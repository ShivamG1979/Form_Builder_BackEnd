import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

config({ path: ".env" });

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB setup
mongoose.connect(process.env.MONGO_URL, { 
  dbName: "FORM_BUILDER",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB is Connected..!"))
  .catch(error => console.error("MongoDB connection error:", error));

// Field Schema
const fieldSchema = new mongoose.Schema({
  name: String,
  type: String
});

// Form Schema
const formSchema = new mongoose.Schema({
  name: String,
  fields: [fieldSchema]
});

// Form model
const Form = mongoose.model('Form', formSchema);

// Create operation - Add a new form
app.post('/api/forms', async (req, res) => {
  const formData = req.body;
  try {
    const savedForm = await Form.create(formData);
    res.json({ message: 'Form submitted successfully', form: savedForm });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form', message: error.message });
  }
});

// Read operation - Get all forms
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get forms', message: error.message });
  }
});

// Update operation - Update a form by ID
app.put('/api/forms/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFormData = req.body;
  try {
    const updatedForm = await Form.findByIdAndUpdate(id, updatedFormData, { new: true });
    res.json({ message: 'Form updated successfully', form: updatedForm });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update form', message: error.message });
  }
});

// Delete operation - Delete a form by ID
app.delete('/api/forms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Form.findByIdAndDelete(id);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form', message: error.message });
  }
});

// Server Setup
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));
