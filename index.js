import rl from 'readline'
import { MongoClient } from 'mongodb'
var client = await new MongoClient(process.argv[2] || 'mongodb://127.0.0.1:27017').connect()
var contactlist = client.db('contact').collection('contactlist')
await contactlist.deleteMany({})
var rli = rl.createInterface(process.stdin, process.stdout)
var { insertedIds: ids } = await contactlist.insertMany([
  { last_name: 'Ben Lahmer', first_name: 'Fares', email: 'fares@gmail.com', age: 26 },
  { last_name: 'Kefi', first_name: 'Seif', email: 'kefi@gmail.com', age: 15 },
  { last_name: 'Fatnassi', first_name: 'Sarra', email: 'sarra.f@gmail.com', age: 40 },
  { last_name: 'Ben Yahia', first_name: 'Rym', age: 4 },
  { last_name: 'Cherif', first_name: 'Sami', age: 3 },
])
console.clear()
await (async (...args) => {
  for (var [task, res] of args) await new Promise(async (resolve) => {
    console.log(task); console.log(await res)
    rli.question('press enter to continue...', () => {
      console.clear(); resolve()
    })
  })
})(
  [
    `- Display all of the contacts list.`,
    contactlist.find({}).toArray()
  ],
  [
    `- Display all the information about only one person using his ID.`,
    contactlist.findOne({ _id: ids[Math.floor(Math.random() * 5)] })
  ],
  [
    `- Display all the contacts with an age >18.`,
    contactlist.find({ age: { $gt: 18 } }).toArray()
  ],
  [
    `- Display all the contacts with an age>18 and name containing "ah".`,
    contactlist.find({ age: { $gt: 18 }, $or: [{ last_name: { $regex: /ah/i } }, { first_name: { $regex: /ah/i } }] }).toArray()
  ],
  [
    `- Change the contact's first name from"Kefi Seif" to "Kefi Anis".`,
    contactlist.updateOne({ last_name: 'Kefi', first_name: 'Seif' }, { $set: { first_name: 'Anis' } })
  ],
  [
    `- Delete the contacts that are aged under <5.`,
    contactlist.deleteMany({ age: { $lt: 5 } })
  ],
  [
    `- Display all of the contacts list.`,
    contactlist.find({}).toArray()
  ],
)
await client.close(true)
rli.close()