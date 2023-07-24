
// RESUME LIST PAGE //
        
        // IDEA //
// VALIDATION EMAIL / PHONE_NUMBER
// IMAGE FROM FILE
// FIND NAME WITH DATABASE WITH INPUT
// COLOR DETAIL MAN = BLUE / WMAN = PINK
// ADD INPUT FOR SKILL 
// COLOR CHOICE RESUME
// SAVE JPG

        // ERROR
// RADIO

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { body, validationResult, check } = require('express-validator');

// const route = require('./routeConnect/route');
const { Data } = require('./data/db');
// const { ans } = require('./adjustCode/script');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(express.json());

// HOME
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        layout: 'layout/temp-layout'
    });
});

// ADDING ITEMS
app.get('/project/adding', (req, res) => {
    res.render('adding', {
        title: 'Adding List',
        layout: 'layout/temp-layout'
    });
})

// app.use('/project', route);

app.route('/project')
// FULL LIST DETAIL
.get(async (req, res) => {
    const readAll = await Data.find();
        res.render('project', {
            title: 'Project',
            layout: 'layout/temp-layout',
            readAll
        });

        // POST AFTER ADD ITEMS
}).post([
    check('email', `Error On Your Email Address`).isEmail(),
    check('number', `Error On Phone Number`).isMobilePhone('ms-MY')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(404).json({ errors: errors.array() });
        res.render('adding', {
            title: 'Adding List',
            layout: 'layout/temp-layout',
            errors: errors.array()
        });
    } else {
        // console.log(req.body);
        await Data.insertMany(req.body);
        res.redirect('/project');
    }
});

// RESUME PREVIEW 
app.get('/project/:name', async (req, res) => {
    const read = await Data.findOne({ name: req.params.name });
    res.render('resume', {
        title: 'Resume',
        layout: 'layout/temp-layout',
        read
    });
});

// UPDATE EACH ITEMS
app.get('/update/:name', async (req, res) => {
    const read = await Data.findOne({ name: req.params.name });
    res.render('update', {
        title: "Edit Resume",
        layout: 'layout/temp-layout',
        read
    });
});

// DELETE EACH ITEMS
app.delete('/project', async (req, res) => {
    await Data.deleteOne({ name: req.body.name });
    res.redirect('/project');
});

app.put('/project', [
    check('email', 'Invalid Email Address').isEmail(),
    check('number', 'Invalid Phone Number').isMobilePhone('ms-MY'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('update', {
            title: "Edit Resume",
            layout: 'layout/temp-layout',
            errors: errors.array()
        });
    } else {
        await Data.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    gender: req.body.gender,
                    email: req.body.email,
                    number: req.body.number,
                    area: req.body.area,
                    job: req.body.job,
                    profile: req.body.profile,
                    skill: req.body.skill,
                    education: req.body.education,
                    workExp: req.body.workExp
                }
            });
            res.redirect('/project');
            // console.log(req.body);
    }
});

app.use((req, res) => {
    res.status(404).json({
        status: res.statusCode
    });
});

app.listen(port, () => console.log(`http://localhost:${port}/`));