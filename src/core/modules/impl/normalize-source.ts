export function normalizeContractSource(contractSrc: string): string {
  // Convert from ES Module format to something we can run inside a Function.
  // Removes the `export` keyword and adds ;return handle to the end of the function.
  // Additionally it removes 'IIFE' declarations
  // (which may be generated when bundling multiple sources into one output file
  // - eg. using esbuild's "IIFE" bundle format).
  // We also assign the passed in SmartWeaveGlobal to SmartWeave, and declare
  // the ContractError exception.
  // We then use `new Function()` which we can call and get back the returned handle function
  // which has access to the per-instance globals.

  const firstLastLineRegexp = /^(?:(?<![\f\n\r])(?:.*))(?=[\f\n\r])|^.*(?![\f\n\r])$/gm;
  const search = contractSrc.match(firstLastLineRegexp);

  if (search.length == 2) {
    if (
      (/\(\s*\(\)\s*=>\s*{/g.test(search[0]) || /\s*\(\s*function\s*\(\)\s*{/g.test(search[0])) &&
      /}\s*\)\s*\(\)\s*;/g.test(search[1])
    ) {
      const lines = contractSrc.split('\n');
      lines.shift();
      lines.pop();
      contractSrc = lines.join('\n');
    }
  }

  contractSrc = contractSrc
    .replace(/export\s+async\s+function\s+handle/gmu, 'async function handle')
    .replace(/export\s+function\s+handle/gmu, 'function handle');

  return `
    const [SmartWeave, BigNumber, clarity, logger] = arguments;
    clarity.SmartWeave = SmartWeave;
    class ContractError extends Error { constructor(message) { super(message); this.name = 'ContractError' } };
    function ContractAssert(cond, message) { if (!cond) throw new ContractError(message) };
    ${contractSrc};
    return handle;
  `;
}