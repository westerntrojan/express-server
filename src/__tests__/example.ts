const sum = (a: number, b: number): number => {
	return a + b;
};

describe('example module', () => {
	it('function sum', () => {
		const expected = 20;

		const result = sum(10, 10);

		expect(result).toEqual(expected);
	});
});
