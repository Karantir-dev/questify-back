const express = require("express");
const router = express.Router();
const {
  getAll,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../controller/contacts.js");
const { validatePatch, validatePostPut } = require("./inputValidation.js");
const guard = require("../../helpers/guard");

router.get("/", guard, getAll).post("/", guard, validatePostPut, addContact);

router
  .get("/:contactId", guard, getContactById)
  .put("/:contactId", guard, validatePostPut, updateContact)
  .delete("/:contactId", guard, removeContact)
  .patch("/:contactId", guard, validatePatch, updateContact);

module.exports = router;
