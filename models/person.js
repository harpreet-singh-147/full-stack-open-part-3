const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(e => console.log(`error connecting to MongoDB: ${e.message}`));

const nameValidator = {
  validator: name => name.length >= 3,
  message: props => `Name (${props.value}) must be 3 or more characters`,
};

const numberValidator = {
  validator: number => /^\d{2,3}-\d+$/.test(number) && number.length >= 8,
  message: props => `${props.value} is not a valid phone number!`,
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,

    required: [true, 'Name is required'],
    validate: nameValidator,
  },
  number: {
    type: String,
    required: [true, 'Phone number required'],
    validate: numberValidator,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
