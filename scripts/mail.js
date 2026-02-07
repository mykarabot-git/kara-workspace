const nodemailer = require('nodemailer');
const imaps = require('imap-simple');

const CONFIG = {
    user: 'kara@mykarabot.online',
    pass: 'Starbuck_Returns_2026!',
    host: {
        smtp: 'smtp.ionos.com',
        imap: 'imap.ionos.com'
    }
};

async function sendMail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: CONFIG.host.smtp,
        port: 587,
        secure: false, // StartTLS
        auth: {
            user: CONFIG.user,
            pass: CONFIG.pass
        }
    });

    const info = await transporter.sendMail({
        from: `"KARA" <${CONFIG.user}>`,
        to: to,
        subject: subject,
        text: text
    });

    console.log("Message sent: %s", info.messageId);
}

async function checkMail() {
    const connection = await imaps.connect({
        imap: {
            user: CONFIG.user,
            password: CONFIG.pass,
            host: CONFIG.host.imap,
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    });

    await connection.openBox('INBOX');
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
    
    const messages = await connection.search(searchCriteria, fetchOptions);
    
    if (messages.length === 0) {
        console.log("No new messages.");
    } else {
        console.log(`Found ${messages.length} new message(s):`);
        messages.forEach(msg => {
            const subject = msg.parts.filter(p => p.which === 'HEADER')[0].body.subject[0];
            const from = msg.parts.filter(p => p.which === 'HEADER')[0].body.from[0];
            console.log(`- From: ${from} | Subject: ${subject}`);
        });
    }
    
    connection.end();
}

// CLI Args
const args = process.argv.slice(2);
const command = args[0];

if (command === 'send') {
    const to = args[1];
    const subject = args[2];
    const text = args[3];
    sendMail(to, subject, text).catch(console.error);
} else if (command === 'check') {
    checkMail().catch(console.error);
} else {
    console.log("Usage: node mail.js send <to> <subject> <text> | node mail.js check");
}
