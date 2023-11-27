// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

// The configured entrypoint for the 'purchase.validation.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const error = {
    localizedMessage: "A product can only have a maximum of 5 items.",
    target: "cart",
  };
  const errors = [];

  for (const line of input.cart.deliverableLines) {
    if (line.quantity > 5) {
      errors.push(error);
      break;
    }
  }

  return { errors };
}
