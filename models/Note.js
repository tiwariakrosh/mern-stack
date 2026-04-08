const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        ticket: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

// Manual auto-increment for ticket
noteSchema.pre('save', async function () {
    if (this.isNew) {
        const lastNote = await this.constructor.findOne({}, {}, { sort: { ticket: -1 } })
        this.ticket = lastNote ? lastNote.ticket + 1 : 500
    }
})

module.exports = mongoose.model('Note', noteSchema)