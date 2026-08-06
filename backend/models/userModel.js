import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type:String,
    required:true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  role: {
    type: String,
    enum: ["student", "alumni"],
    required: true
  },

  batch: {
    type: String,
    match: [/^\d{4}-\d{2}$/, "Batch must be in format YYYY-YY (e.g., 2022-26)"],
    required: true
  },

  password: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true,
    trim: true
  },

  currentEmploymentStatus: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "alumni";
    }
  },

  // User-editable profile details
  bio: {
    type: String,
    trim: true,
    default: ""
  },

  about: {
    type: String,
    trim: true,
    default: ""
  },

  location: {
    type: String,
    trim: true,
    default: ""
  },

  avatar: {
    type: String,
    default: ""
  },

  coverImage: {
    type: String,
    default: ""
  },

  skills: [
    {
      name: { type: String, required: true, trim: true },
      endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    }
  ],

  projects: [
    {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      tags: [{ type: String, trim: true }],
      status: { type: String, trim: true, default: "Live" },
      link: { type: String, trim: true }
    }
  ],

  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  savedPosts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
  ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
