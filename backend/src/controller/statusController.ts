import { Router } from 'express';

const router = Router();

const randomMessages = [
    "✨ Hey there! @prodbyeagle was here. Ready for some magic?",
    "👀 Hold up! Are you snooping around? Caught you! 😜",
    "👨‍💻 Nice try! You’ve been caught snooping! Now, go build something cool!",
    "🕵️‍♂️ Looking around, huh? Well, you’re on the right track. 🧐",
];

router.get('/', (req, res) => {
    const uptime = process.uptime();

    const status = {
        uptime: `${uptime.toFixed(2)} seconds since startup`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
    };

    res.setHeader('Content-Type', 'application/json');
    res.json(status);
});

export default router;