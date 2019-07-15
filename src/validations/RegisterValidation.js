function passwordValidation(passwordValue,password2Value, passwordLength){
 const messages = {
   character: '#dc3545',
   bottomLineCharacters: '#dc3545',
   includingNumber: '#dc3545',
   lowerCaseLetters: '#dc3545'
  }
  
  if (passwordLength >= 8) {
    messages.bottomLineCharacters = "#28a745";
  } 
  if (passwordValue.match(/([a-z])/)){
    messages.lowerCaseLetters = "#28a745";
  }
  if (passwordValue.match(/([1-9])/)) {
    messages.includingNumber = "#28a745";
  }
  if (passwordLength >= 8 && passwordValue.match(/([1-9])/) && passwordValue.match(/([a-z])/) ) {
    messages.bottomLineCharacters = "#28a745";
    messages.includingNumber = "#28a745";
    messages.lowerCaseLetters = "#28a745";
    messages.character = "#586069";
  } 
  if (passwordLength >= 15) {
    messages.character = "#28a745";
    messages.bottomLineCharacters = "#586069";
    messages.includingNumber = "#586069";
    messages.lowerCaseLetters = "#586069";
  }

  return {
    messages
  };
}

module.exports = passwordValidation;