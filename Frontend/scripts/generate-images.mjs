import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import products from "../src/data/products.data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../src/assets/products");
const logFile = path.join(__dirname, "photo-log.json");
fs.mkdirSync(outDir, { recursive: true });

const KEY = process.env.PEXELS_KEY;
if (!KEY) {
    console.error('PEXELS_KEY set nahi hai. Pehle: $env:PEXELS_KEY="tumhari_key"');
    process.exit(1);
}

const FORCE = process.argv.includes("--force"); // purani photo bhi dobara download
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]; // jaise --only=shirt

// Kisi product ki photo galat aaye to yahan us ka search text likho, phir --force ke saath chalao
const QUERY_OVERRIDES = {
    // "shirt-02": "men oxford shirt blue",
};

const FALLBACK = {
    Shirts: "shirt",
    "T-Shirts": "t-shirt",
    Pants: "trousers",
    Cloths: "clothing fashion",
    Electronics: "gadget",
};
if (/phone/.test(n))
    return { base: 540, svg: `<rect x="195" y="110" width="210" height="430" rx="36" fill="${body}"/><rect x="209" y="128" width="182" height="394" rx="24" fill="#0f1218"/><rect x="223" y="146" width="154" height="150" rx="14" fill="${acc}" opacity=".85"/><circle cx="300" cy="118" r="4" fill="${hi}"/>` };

if (/laptop/.test(n))
    return { base: 440, svg: `<rect x="160" y="190" width="280" height="190" rx="14" fill="${body}"/><rect x="172" y="202" width="256" height="166" rx="6" fill="#0f1218"/><rect x="186" y="216" width="228" height="48" rx="6" fill="${acc}" opacity=".85"/><path d="M110 380 L490 380 L470 424 Q468 440 450 440 L150 440 Q132 440 130 424 Z" fill="${hi}"/><rect x="262" y="384" width="76" height="8" rx="4" fill="${body}"/>` };

if (/monitor/.test(n))
    return { base: 486, svg: `<rect x="130" y="160" width="340" height="230" rx="16" fill="${body}"/><rect x="144" y="174" width="312" height="202" rx="8" fill="#0f1218"/><rect x="160" y="190" width="150" height="90" rx="6" fill="${acc}" opacity=".85"/><rect x="282" y="390" width="36" height="80" fill="${hi}"/><rect x="220" y="470" width="160" height="16" rx="8" fill="${body}"/>` };

if (/ssd|drive|disk/.test(n))
    return { base: 400, svg: `<rect x="180" y="170" width="240" height="230" rx="22" fill="${body}"/><rect x="200" y="190" width="200" height="14" rx="7" fill="${acc}"/><circle cx="300" cy="290" r="40" fill="${hi}"/><circle cx="300" cy="290" r="14" fill="${acc}"/>` };

const who = (p) => (p.gender === "Men" ? "men" : p.gender === "Women" ? "women" : "");
const buildQuery = (p) => QUERY_OVERRIDES[p.image] || `${p.name} ${who(p)}`.trim();

const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, "utf8")) : {};
const used = new Set(Object.values(log).map((v) => v.id)); // ek hi photo do products par na lage

const hasPhoto = (name) =>
    ["jpg", "jpeg", "png", "webp"].some((ext) => fs.existsSync(path.join(outDir, `${name}.${ext}`)));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const search = async (query) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (res.status === 401) throw new Error("API key galat hai");
    if (!res.ok) throw new Error(`Pexels error ${res.status}`);
    const data = await res.json();
    return (data.photos || []).filter((ph) => !used.has(ph.id));
};

let done = 0, skipped = 0, failed = 0;

for (const p of products) {
    if (only && !p.image.startsWith(only)) continue;

    if (!FORCE && hasPhoto(p.image)) {
        skipped++;
        continue;
    }

    try {
        let photos = await search(buildQuery(p));
        if (!photos.length) photos = await search(`${FALLBACK[p.category]} ${who(p)}`.trim());
        if (!photos.length) throw new Error("koi photo nahi mili");

        const photo = photos[0];
        const img = await fetch(photo.src.portrait);
        if (!img.ok) throw new Error(`download fail ${img.status}`);

        fs.writeFileSync(path.join(outDir, `${p.image}.jpg`), Buffer.from(await img.arrayBuffer()));
        used.add(photo.id);
        log[p.image] = { id: photo.id, name: p.name, photographer: photo.photographer, url: photo.url };
        fs.writeFileSync(logFile, JSON.stringify(log, null, 2));

        done++;
        console.log(`OK   ${p.image}.jpg  <-  ${p.name}`);
    } catch (err) {
        if (err.message === "RATE_LIMIT") {
            console.error("Rate limit lag gayi. Thodi der baad dobara chalao, jo ho chuka wo skip ho jayega.");
            break;
        }
        failed++;
        console.log(`FAIL ${p.image}  (${p.name}): ${err.message}`);
    }

    await sleep(400); // API ko dheere dheere hit karo
}

console.log(`\nDone: ${done} downloaded, ${skipped} skipped, ${failed} failed`);