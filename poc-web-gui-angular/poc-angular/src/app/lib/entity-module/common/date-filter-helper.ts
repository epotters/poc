import * as moment from 'moment';
import {Moment} from 'moment';
import {FilterBuilder} from "./filter-builder";

export interface SearchDate {
  term: string;
  valid: boolean;
  validationMessage?: string;
  normalizedTerm: string | null;
  type?: 'year' | 'month' | 'dayofyear' | 'date'
  startDate?: Moment;
  endDate?: Moment;
}


export class DateFilterHelper {

  yearPattern: RegExp = new RegExp('^[0-9]{4}-?$');
  yearMonthPattern: RegExp = new RegExp('^[0-9]{4}-[0-9]{2}-?$');
  monthDayPattern: RegExp = new RegExp('^[0-9]{2}-[0-9]{2}$');

  defaultFormat: string = 'YYYY-MM-DD';
  supportedFormats: string[] = [this.defaultFormat, 'DD-MM-YYYY'];


  parse(term: string): string | null {
    let filterValue: string | null = null;
    const parts: string[] = term.split(FilterBuilder.rangeDenominator);

    if (parts.length == 1) {
      const searchDate: SearchDate = this.processDateTerm(term);
      if (searchDate.valid) {
        filterValue = searchDate.normalizedTerm;
      } else {
        console.debug('Invalid single search date');
      }
    } else if (parts.length == 2) {

      const startSearchDate = (!!parts[0]) ? this.processDateTerm(parts[0]) : null;
      const endSearchDate = (!!parts[1]) ? this.processDateTerm(parts[1]) : null;

      if (startSearchDate && startSearchDate.valid) {
        filterValue = startSearchDate.normalizedTerm;
      }
      filterValue += FilterBuilder.rangeDenominator;

      if (endSearchDate && endSearchDate.valid) {
        // @ts-ignore
        filterValue += endSearchDate.normalizedTerm;
      }
    }

    console.debug('filterValue:', filterValue);

    return filterValue;
  }


  processDateTerm(term: string): SearchDate {

    const result: SearchDate = {
      term: term,
      valid: false,
      normalizedTerm: null
    };

    if (this.yearPattern.test(term)) {

      result.valid = true;
      result.normalizedTerm = term.substring(0, 4);
      result.type = 'year';
      result.startDate = moment(`${result.normalizedTerm}-01-01`);
      result.endDate = moment(`${result.normalizedTerm}-12-31`);

    } else if (this.yearMonthPattern.test(term)) {

      result.normalizedTerm = term.substring(0, 7);
      if (moment(`${result.normalizedTerm}-01`).isValid()) {
        result.valid = true;
        result.normalizedTerm = term.substring(0, 7);
        result.type = 'month';
        result.startDate = moment(`${result.normalizedTerm}-01`);
        result.endDate = result.startDate.clone().add(1, 'month').subtract(1, 'day');
      } else {
        result.valid = false;
        result.validationMessage = `Month "${result.normalizedTerm}" does not exist`;
        result.normalizedTerm = null;
      }

    } else if (this.monthDayPattern.test(term)) {

      result.normalizedTerm = term;
      if (moment(`2004-${result.normalizedTerm}`).isValid()) {
        result.valid = true;
        result.type = 'dayofyear';
      } else {
        result.valid = false;
        result.validationMessage = `Day of the year "${result.normalizedTerm}" does not exist`;
        result.normalizedTerm = null;
      }

    } else {

      for (let format of this.supportedFormats) {
        if (moment(term, format, true).isValid()) {
          console.debug(`Date pattern matched "${format}"`);
          result.valid = true;
          result.normalizedTerm = moment(term, format, true).format(this.defaultFormat);
          result.type = 'date';
          result.startDate = moment(term, format, true);
          result.endDate = result.startDate.clone();
          break;
        }
      }
    }

    if (result.valid) {
      console.debug(`Term "${term}" is a valid "${result.type}"`);
      console.debug(`normalizedTerm: "${result.normalizedTerm}"`);
      console.debug(`startDate: "${(result.startDate) ? result.startDate.format(this.defaultFormat) : ''}"`);
      console.debug(`endDate: "${(result.endDate) ? result.endDate.format(this.defaultFormat) : ''}"`);
    } else {
      result.validationMessage = (!!result.validationMessage) ? result.validationMessage :
        `Term ${term} does not match any supported pattern`;

      console.debug(result.validationMessage);
    }
    console.debug('\n');

    return result;
  }
}
