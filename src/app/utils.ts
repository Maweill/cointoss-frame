export function validateBetInput(input: string): boolean {
  const numericInput = parseFloat(input);
  return (
    !isNaN(numericInput) && numericInput > 0 && Number.isFinite(numericInput)
  );
}
