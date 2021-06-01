const HttpCode = require('../helpers/constants');
const contacts = require('../model/contacts');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { allContacts, total, limit, page } = await contacts.dbGetAll(
      userId,
      req.query
    );

    return res.json({
      status: `${HttpCode.OK} success`,
      contacts: [...allContacts],
      total,
      limit,
      page,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbGetContactById(
      req.params.contactId,
      userId
    );

    if (contact) {
      return res.json({
        status: `${HttpCode.OK} success`,
        contact,
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: `${HttpCode.NOT_FOUND} Not Found`,
    });
  } catch (err) {
    err.status = 'Bad Request';
    if (err.name === 'CastError') {
      err.code = HttpCode.BAD_REQUEST;
      err.message = 'Id format is not correct.';
    }

    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const {
      body: { email, phoneNumber },
      user: { _id },
    } = req;

    // Checking for the presence of email and phone number in existing contacts
    const existContact = await contacts.dbFindByEmailAndPhone(
      _id,
      email,
      phoneNumber
    );
    if (existContact?.email === email) {
      return res.status(HttpCode.CONFLICT).json({
        status: `${HttpCode.CONFLICT} error`,
        message: 'This email is already used in your contacts',
      });
    } else if (existContact?.phoneNumber === phoneNumber) {
      return res.status(HttpCode.CONFLICT).json({
        status: `${HttpCode.CONFLICT} error`,
        message: 'This phone number is already used in your contacts',
      });
    }

    // Creating a new contact
    const contact = await contacts.dbAddContact(req.body, _id);

    if (contact) {
      return res.status(HttpCode.CREATED).json({
        status: `${HttpCode.CREATED} success`,
        createdContact: contact,
      });
    }
  } catch (err) {
    console.log(`error ${err}`);
    err.status = 'error';
    if (err.name === 'MongoError') {
      err.code = HttpCode.BAD_REQUEST;
      err.message = `Contact with this field ${JSON.stringify(
        err.keyValue
      ).replace(/"/g, "'")} already exist`;
    }
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbUpdateContact(
      req.params.contactId,
      userId,
      req.body
    );

    if (contact) {
      return res.json({
        status: `${HttpCode.OK}success`,
        updatedContact: contact,
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      Status: `${HttpCode.NOT_FOUND} Not found`,
    });
  } catch (err) {
    err.status = 'Bad Request';

    if (err.name === 'CastError') {
      err.code = HttpCode.BAD_REQUEST;
      err.message = 'Id format is not correct.';
    } else if (err.name === 'MongoError') {
      err.code = HttpCode.BAD_REQUEST;
      err.message = `Contact with this field 
      ${JSON.stringify(err.keyValue).replace(/"/g, "'")} already exist.`;
    }

    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbRemoveContact(
      req.params.contactId,
      userId
    );

    if (contact) {
      return res.json({
        status: `${HttpCode.OK}success`,
        deletedContact: contact,
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: `${HttpCode.NOT_FOUND} Not Found`,
      message: `Contact with this id: ${req.params.contactId} is absent.`,
    });
  } catch (err) {
    err.status = 'Bad Request';
    if (err.name === 'CastError') {
      err.code = HttpCode.BAD_REQUEST;
      err.message = 'Id format is not correct.';
    }
    next(err);
  }
};

module.exports = {
  getAll,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
