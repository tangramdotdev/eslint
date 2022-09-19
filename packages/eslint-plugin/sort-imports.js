let findErroredBlocks = (node) => {
	let erroredBlocks = [];
	let currentBlock = [];
	let currentBlockHasError = false;
	// loop over the statements in the body and collect blocks
	// of import declarations that have errors
	for (let i = 0; i < node.body.length - 1; i++) {
		let currentNode = node.body[i];
		let previousDeclaration = currentBlock[currentBlock.length - 1];
		if (
			// if the node is not an declaraction then finish the block
			currentNode.type !== "ImportDeclaration"
		) {
			if (currentBlockHasError) {
				erroredBlocks.push(currentBlock);
			}
			currentBlock = [];
			currentBlockHasError = false;
		} else if (
			// if the declaration is not on the line
			// following the previous then finish the block
			currentNode.loc &&
			previousDeclaration &&
			previousDeclaration.loc &&
			previousDeclaration.loc.end.line + 1 != currentNode.loc.start.line
		) {
			if (currentBlockHasError) {
				erroredBlocks.push(currentBlock);
			}
			currentBlock = [currentNode];
			currentBlockHasError = false;
		} else {
			// add the current to the current block
			currentBlock.push(currentNode);
			// check if the is out of order
			if (
				previousDeclaration &&
				compare(previousDeclaration, currentNode) > 0
			) {
				currentBlockHasError = true;
			}
		}
	}
	// if the file ends in a block and it has an error, add it
	if (currentBlock.length > 0 && currentBlockHasError) {
		erroredBlocks.push(currentBlock);
	}
	return erroredBlocks;
};

let reportErrors = (context, erroredBlocks) => {
	for (let block of erroredBlocks) {
		let firstDeclaration = block[0];
		let lastDeclaration = block[block.length - 1];
		if (!firstDeclaration.loc || !lastDeclaration.loc) {
			throw Error();
		}
		context.report({
			fix: (fixer) =>
				block
					.slice()
					.sort(compare)
					.map((Declaration, i) => ({
						newDeclaration: Declaration,
						oldDeclaration: block[i],
					}))
					.map(({ newDeclaration, oldDeclaration }) => {
						if (!oldDeclaration.range || !newDeclaration.range) {
							throw Error();
						}
						return fixer.replaceTextRange(
							oldDeclaration.range,
							context
								.getSourceCode()
								.getText()
								.slice(...newDeclaration.range),
						);
					}),
			loc: {
				end: lastDeclaration.loc.end,
				start: firstDeclaration.loc.start,
			},
			message: "Expected module declarations to be sorted",
		});
	}
};

let compare = (a, b) => {
	if (
		typeof a.source.value !== "string" ||
		typeof b.source.value !== "string"
	) {
		return 0;
	}
	if (a.source.value < b.source.value) {
		return -1;
	} else if (a.source.value > b.source.value) {
		return 1;
	} else {
		return 0;
	}
};

module.exports = {
	create: (context) => ({
		Program: (node) => {
			if (node.type !== "Program") {
				throw Error();
			}
			// find all blocks with errors
			let erroredBlocks = findErroredBlocks(node);
			// report eslint errors for each of the blocks with errors
			reportErrors(context, erroredBlocks);
		},
	}),
	meta: {
		fixable: "code",
	},
};
