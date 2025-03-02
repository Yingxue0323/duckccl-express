import Exercise from '../src/models/Exercise';
import { connect, connection } from 'mongoose';
import { config } from '../src/configs/index';

async function addOrderToExistingExercises() {
  await connect(config.mongodb.uri || '');
  console.log('已连接到数据库');
  
  const exercises = await Exercise.find().sort('createdAt');
  
  for (let i = 0; i < exercises.length; i++) {
    await Exercise.findByIdAndUpdate(exercises[i]._id, {
      order: i + 1
    });
  }
  
  console.log('Migration completed');
  process.exit(0);
}

addOrderToExistingExercises().catch(console.error); 