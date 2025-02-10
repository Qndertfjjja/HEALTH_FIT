import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true,
  },
  foodItems: [{
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: Number,
    carbs: Number,
    fats: Number,
    servingSize: String,
  }],
  totalCalories: {
    type: Number,
    required: true,
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Nutrition || mongoose.model('Nutrition', nutritionSchema);
