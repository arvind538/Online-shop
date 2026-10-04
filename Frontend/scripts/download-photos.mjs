import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import products from "../src/data/products.data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../src/assets/products");
const logFile = path.join(__dirname, "photo-log.json");
fs.mkdirSync(outDir, { recursive: true });

const KEY = process.env.UNSPLASH_KEY;
if (!KEY) {
    console.error('UNSPLASH_KEY set nahi hai. Pehle chalao: $env:UNSPLASH_KEY="g0PZCTaVb6u0UOfkabY6XEnF4HFkt0t9AxV6t0wflI0"');
    process.exit(1);
}

const FORCE = process.argv.includes("--force"); // purani photo bhi dobara download
const WAIT = process.argv.includes("--wait");   // hourly limit khatam ho to khud wait karke aage badhe
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]; // jaise --only=shirt

// Kisi product ki photo galat aaye to yahan us ka search text likho, phir --force ke saath chalao
const QUERY_OVERRIDES = {
    // "shirt-02": "men blue oxford shirt",
};

const FALLBACK = {
    Shirts: "shirt",
    "T-Shirts": "t-shirt",
    Pants: "trousers",
    Cloths: "clothing fashion",
    Electronics: "gadget",
};

const who = (p) => (p.gender === "Men" ? "men" : p.gender === "Women" ? "women" : "");
const buildQuery = (p) => QUERY_OVERRIDES[p.image] || `${p.name} ${who(p)}`.trim();

const headers = { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" };

const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, "utf8")) : {};
const used = new Set(Object.values(log).map((v) => v.id)); // ek photo do products par na lage

const hasPhoto = (name) =>
    ["jpg", "jpeg", "png", "webp"].some((ext) => fs.existsSync(path.join(outDir, `${name}.${ext}`)));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class RateLimitError extends Error { }

const search = async (query) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait&content_filter=high`;
    const res = await fetch(url, { headers });
    if (res.status === 401) throw new Error("Access Key galat hai");
    if (res.status === 403) throw new RateLimitError();
    if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
    const data = await res.json();
    return (data.results || []).filter((ph) => !used.has(ph.id));
};

const searchWithWait = async (query) => {
    while (true) {
        try {
            return await search(query);
        } catch (err) {
            if (!(err instanceof RateLimitError) || !WAIT) throw err;
            console.log("Hourly limit poori ho gayi. 61 minute wait, terminal band mat karna...");
            await sleep(61 * 60 * 1000);
        }
    }
};

let done = 0, skipped = 0, failed = 0;

for (const p of products) {
    if (only && !p.image.startsWith(only)) continue;

    if (!FORCE && hasPhoto(p.image)) {
        skipped++;
        continue;
    }

    try {
        let photos = await searchWithWait(buildQuery(p));
        if (!photos.length) photos = await searchWithWait(`${FALLBACK[p.category]} ${who(p)}`.trim());
        if (!photos.length) throw new Error("koi photo nahi mili");

        const photo = photos[0];
        const sep = photo.urls.raw.includes("?") ? "&" : "?";
        const img = await fetch(`${photo.urls.raw}${sep}w=800&h=1000&fit=crop&q=80&fm=jpg`);
        if (!img.ok) throw new Error(`download fail ${img.status}`);

        fs.writeFileSync(path.join(outDir, `${p.image}.jpg`), Buffer.from(await img.arrayBuffer()));

        // Unsplash ko batana ki photo download hui (unki guideline)
        fetch(photo.links.download_location, { headers }).catch(() => { });

        used.add(photo.id);
        log[p.image] = {
            id: photo.id,
            name: p.name,
            photographer: photo.user?.name,
            profile: photo.user?.links?.html,
            url: photo.links?.html,
        };
        fs.writeFileSync(logFile, JSON.stringify(log, null, 2));

        done++;
        console.log(`OK   ${p.image}.jpg  <-  ${p.name}`);
    } catch (err) {
        if (err instanceof RateLimitError) {
            console.error("Hourly limit khatam. 1 ghante baad dobara chalao (ya --wait lagao). Jo ho chuka wo skip hoga.");
            break;
        }
        if (err.message === "Access Key galat hai") {
            console.error(err.message);
            break;
        }
        failed++;
        console.log(`FAIL ${p.image}  (${p.name}): ${err.message}`);
    }

    await sleep(400);
}

console.log(`\nDone: ${done} downloaded, ${skipped} skipped, ${failed} failed`);