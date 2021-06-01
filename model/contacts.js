const Contact = require('./schemas/contact');

const dbGetAll = async (userId, query) => {
  const { limit = 20, page = 1, favourite = null } = query;
  const searchOptions = { owner: userId };
  if (favourite !== null) {
    searchOptions.favourite = favourite;
  }
  const result = await Contact.paginate(searchOptions, {
    limit,
    page,
    populate: {
      path: 'owner',
      select: 'email subscription',
    },
  });
  const { docs: allContacts, totalDocs: total } = result;

  return { allContacts, total, limit, page };
};

const dbGetContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'email',
  });
};

const dbRemoveContact = (contactId, userId) => {
  return Contact.findByIdAndRemove({ _id: contactId, owner: userId });
};

const dbAddContact = (body, userId) => {
  return Contact.create({ ...body, owner: userId });
};

const dbUpdateContact = async (contactId, userId, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  );
};

const dbFindByEmailAndPhone = async (userId, email, phoneNumber) => {
  return await Contact.findOne({
    owner: userId,
    $or: [{ email }, { phoneNumber }],
  });
};

module.exports = {
  dbGetAll,
  dbGetContactById,
  dbRemoveContact,
  dbAddContact,
  dbUpdateContact,
  dbFindByEmailAndPhone,
};
