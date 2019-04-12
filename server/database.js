var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, unique: true},
  exercises: [{
    description: String,
    duration: Number,
    date: Date
  }]
});

userSchema.plugin(uniqueValidator);

var User = mongoose.model('User', userSchema);

function addNewUser(newUserName, response) {
  var newUser = new User({username: newUserName});
  var promise = newUser.save();
  promise.then(function(data) {
    response.send({"username": data.username, "_id": data.id});
  }, function(error) {
    response.send("Username " + newUserName + " has already been taken");
  })
};

function addNewExercise(userId, exercise, response) {
  exercise.date ? exercise.date : exercise.date = new Date();
  console.log(exercise);
  var promise = User.findOneAndUpdate({_id: userId}, {"$push": { "exercises": exercise }}, {upsert: true, new: true}).exec();
  promise.then(function(data) {
    console.log(data);
    var lastExerciseDetails = data.exercises[data.exercises.length - 1];
    response.send({"_id": data.id, "username": data.username, "description": lastExerciseDetails.description, "duration": lastExerciseDetails.duration, "date": lastExerciseDetails.date.toString()});
  }, function(error) {
    response.send(error.message);
  });
}

function getUserExerciseLog(query, response) {
  let options = {userId: query.userId}
  if(query.from) {
    options.date = {"$gte": query.from};
  }
  if(query.to) {
    options.date = {"$range": [query.from, query.to]};
  }  
  var promise = User.findOne({ _id: query.userId })
  .exec();
  promise.then(function(data) {
    if(data) {
      if(query.from) {
        var from = new Date(query.from)
        from = from.getTime();
        
        var to;
        query.to ? to = new Date(query.to) : to = new Date();
        to = to.getTime();      
        
        data.exercises = data.exercises.filter(function(exercise) {
          console.log(exercise);
          if(from <= exercise.date.getTime() && to >= exercise.date.getTime()) {
            return exercise;
          }
        });
      }
      if(query.limit) {
        data.exercises = data.exercises.splice(0, query.limit);
      }     
      response.send(data);
    } else {
      response.send("Invalid query, please double-check");
    }
  }, function(error) {
    if (error) response.send(error);
  });  
}

module.exports = { addNewUser, addNewExercise, getUserExerciseLog };
