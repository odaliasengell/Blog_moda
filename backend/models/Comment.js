const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'URL debe comenzar con http:// o https://'
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  approved: {
    type: Boolean,
    default: false
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para mejorar las consultas
commentSchema.index({ article: 1 });
commentSchema.index({ approved: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Middleware para manejar respuestas
commentSchema.pre('save', async function(next) {
  if (this.isNew && this.parentComment) {
    try {
      const parentComment = await mongoose.model('Comment').findById(this.parentComment);
      if (parentComment) {
        parentComment.replies.push(this._id);
        await parentComment.save();
      }
    } catch (error) {
      console.error('Error al actualizar comentario padre:', error);
    }
  }
  next();
});

// Método para aprobar comentario
commentSchema.methods.approve = function() {
  this.approved = true;
  return this.save();
};

// Método para incrementar likes
commentSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Método para reportar comentario
commentSchema.methods.report = function() {
  this.reportCount += 1;
  if (this.reportCount >= 3) {
    this.reported = true;
  }
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);