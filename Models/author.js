import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
 const authorSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    country: {type: String, required:true},
    books:[{type:mongoose.Schema.Types.ObjectId, ref:"books"}]
 });
 authorSchema.plugin(uniqueValidator);
 export default mongoose.model ("authors", authorSchema)