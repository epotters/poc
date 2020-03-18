import {DateFilterHelper} from "./date-filter-helper";


describe('DateFilter tests', () => {
  // suite of tests here


  it('should validate terms for date searches', () => {
    const helper = new DateFilterHelper();

    expect(helper.processDateTerm('1967-03-23').valid).toBe(true);
    expect(helper.processDateTerm('1967-03').valid).toBe(true);
    expect(helper.processDateTerm('1967-03-').valid).toBe(true);
    expect(helper.processDateTerm('1967-03-2').valid).toBe(true);
    expect(helper.processDateTerm('1967-15-').valid).toBe(false);
    expect(helper.processDateTerm('1967').valid).toBe(true);
    expect(helper.processDateTerm('1967-').valid).toBe(true);
    expect(helper.processDateTerm('1967-0').valid).toBe(true);
    expect(helper.processDateTerm('03-23').valid).toBe(true);
    expect(helper.processDateTerm('15-23').valid).toBe(false);
    expect(helper.processDateTerm('23-03-1967').valid).toBe(true);

  });

});
