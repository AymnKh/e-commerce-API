export function validateEgyptPhoneNumber(phoneNumber) {
  const egyptPhoneNumberRegex = /^(?:\+20|0)?1[0125][0-9]{8}$/;
  return egyptPhoneNumberRegex.test(phoneNumber);
}