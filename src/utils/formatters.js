export const formatTokenAmount = (amount) => {
  console.log('Raw amount from contract:', amount.toString())
  
  // Convert BigInt to string and add commas for readability
  const formattedValue = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${formattedValue} GRN`
} 