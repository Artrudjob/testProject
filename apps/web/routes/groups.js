const express = require('express');
const moment = require('moment');
const { Group } = require('../../../models');

const groupsRouter = express.Router();

groupsRouter.post('/addGroup', async (req, res) => {
    try {
        console.log('post group');
        await Group.create({
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            name: req.body.name,
        });

        const group = await Group.findOne({
            name: req.body.name
        })
        res.status(201).json(group);
    } catch (err) {
        console.log(err);
        res.status(500).json({});
    }
});

groupsRouter.get('/:id', async (req, res) => {
    try {
        console.log('get groups id ', req.params.id);
        res.status(200).json(await Group.findOne({
            _id: req.params.id,
        }))
    } catch (err) {
        console.log(err);
        res.status(500).json({})
    }
})

groupsRouter.get('/', async (req, res) => {
    const query = {
        serverId: req.params.serverId,
      };
      try {
        const groups = await Group.find({});
        const rows = await Group.find(query, null, {
          sort: '-date',
          limit: parseInt(groups.length || 10),
          skip: parseInt(groups.start || 0),
        });
        const count = await Group.countDocuments(query);
    
        res.json({
          draw: 1,
          recordsTotal: count,
          recordsFiltered: count,
          data: rows,
        }); 
    } catch (err) {
        console.log(err);
        res.status(500).res.json([]);
    }
});

groupsRouter.put('/', async (req, res) => {
    try {
        console.log('put groups', req.body.id);
        await Group.findByIdAndUpdate(req.body.id, { name: req.body.name })
        res.status(200).json({ status: 'ok' })
    } catch (err) {
        console.log(err);
        res.status(500).send('');
    }
})

groupsRouter.delete('/:id', async (req, res) => {
    try {
        console.log('delete groups name', req.params.id);
        await Group.remove({_id: req.params.id});
        res.status(200).send({status: 'ok'})
    } catch {
        console.log(err);
        res.status(500).send('');
    }
})

module.exports = {
    groupsRouter,
}