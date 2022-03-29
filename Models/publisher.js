import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
 const publisherSchema = new mongoose.Schema({
    name: {type: String, required:true, unique:true},
    foundationYear: {type: Number, required:true},
    books:[{type:mongoose.Schema.Types.ObjectId, ref:"books"}]
 });
 publisherSchema.plugin(uniqueValidator);
 export default mongoose.model ("publishers", publisherSchema)