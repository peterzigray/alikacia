function emailValidation(emailValue, valueLength) {
  const style = {};
  
  style.beforeAt = "#dc3545";
  style.at = "#dc3545";
  style.afterAt = "#dc3545";
  style.domenName = "#dc3545";

  // if (valueLength === 0) {
  for (let i = 0; i < 4; i++) {
    Object.values(style)[i] = "blue";
    console.log(Object.values(style)[i] + " toto je co");
  }
  // }

  for (let i = -1; i < valueLength; i++) {
    if (emailValue.match(/^[a-zA-Z]/)) {
      style.beforeAt = "#28a745";
    }

    if (emailValue.match(/^[^@]*@[^@]*$/)) {
      style.at = "#28a745";
    }
    if (emailValue.match(/@\w*[a-zA-Z]\w*(?=[.])/)) {
      style.afterAt = "#28a745";
    }
    if (
      emailValue.match(
        /^(.*?)\.(arpa|root|aero|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/
      )
    ) {
      style.domenName = "#28a745";
    }
  }

  return {
  style
  };
};
module.exports = emailValidation;