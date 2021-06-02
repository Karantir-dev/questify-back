const { httpStatusCodes } = require('../helpers/httpstatuscodes')
const { ContactsService } = require('../services')
const contactsService = new ContactsService()

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const query = req.query
    const contacts = await contactsService.getAll(userId, query)
    res.status(httpStatusCodes.OK).json({
      status: 'success',
      code: httpStatusCodes.OK,
      message: 'OK',
      data: {
        contacts,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { contactId: id } = req.params
    const contact = await contactsService.getById(userId, id)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'OK',
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await contactsService.create(userId, req.body)
    res.status(httpStatusCodes.CREATED).json({
      status: 'success',
      code: httpStatusCodes.CREATED,
      message: 'contact created',
      data: {
        contact,
      },
    })
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { contactId: id } = req.params
    const contact = await contactsService.remove(userId, id)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'DELETE',
        code: httpStatusCodes.OK,
        message: 'contact deleted',
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { contactId: id } = req.params
    const contact = await contactsService.update(userId, id, req.body)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'contact update',
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { contactId: id } = req.params
    const contact = await contactsService.update(userId, id, req.body)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'contact status is update',
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
