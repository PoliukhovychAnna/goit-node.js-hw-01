const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

// Returns an array of contacts.
async function listContacts() {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  console.table(contacts);
  return contacts;
}

//Returns object of required contact by id or null
async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactToFind =
    contacts.find((contact) => contact.id === contactId) || null;
  console.log(contactToFind);
  return contactToFind;
}

//Returns object of deleted contact or null
async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    console.log(null);
    return null;
  }

  const [deletedContact] = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  console.log(deletedContact);
  return deletedContact;
}

//Returns object of added contact
async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const doesExist = contacts.find(
    (contact) => contact.email === email || contact.phone === phone
  );
  if (!doesExist) {
    const newContact = {
      id: nanoid(),
      name: name,
      email: email,
      phone: phone,
    };
    contacts.push(newContact);
    console.log(`NEWCONTACT >>>>>>> ${JSON.stringify(newContact)}`);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
