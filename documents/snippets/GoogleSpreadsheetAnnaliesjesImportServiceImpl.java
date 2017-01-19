package bowlon.core.service.impl;


import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.data.spreadsheet.CellEntry;
import com.google.gdata.data.spreadsheet.CellFeed;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.data.spreadsheet.ListFeed;
import com.google.gdata.data.spreadsheet.SpreadsheetEntry;
import com.google.gdata.data.spreadsheet.SpreadsheetFeed;
import com.google.gdata.data.spreadsheet.WorksheetEntry;
import com.google.gdata.data.spreadsheet.WorksheetFeed;
import com.google.gdata.util.ServiceException;

import bowlon.core.service.AnnaliesjesImportService;


/**
 * Created by epotters on 2016-01-14
 */

public abstract class GoogleSpreadsheetAnnaliesjesImportServiceImpl extends BaseAnnaliesjesImportService
    implements AnnaliesjesImportService {

  private static final Logger LOG = LoggerFactory.getLogger(GoogleSpreadsheetAnnaliesjesImportServiceImpl.class);

  private static final String SPREADSHEET_BASE_URL = "https://spreadsheets.google.com/feeds/spreadsheets/";
  private static final String SPREADSHEET_FEED_URL = "https://spreadsheets.google.com/feeds/spreadsheets/private/full";

  @Autowired
  private SpreadsheetService spreadsheetService;


  @Override
  public List<String> availableAnnaliesjes() throws IOException, ServiceException {

    List<String> fileNames = new ArrayList<>();

    SpreadsheetFeed spreadsheetEntryFeed = spreadsheetService.getFeed(new URL(SPREADSHEET_FEED_URL), SpreadsheetFeed.class);
    List<SpreadsheetEntry> spreadsheets = spreadsheetEntryFeed.getEntries();
    for (SpreadsheetEntry spreadsheet : spreadsheets) {
      String title = spreadsheet.getTitle().getPlainText();
      LOG.debug("  " + title);
      if (title.endsWith(".xlsx") && title.contains("_bowlon_")) {
        fileNames.add(title);
      }
    }
    return fileNames;
  }


  public void processAnnaliesje(String fileName, Integer leagueNightToProcess) throws Exception {

    SpreadsheetEntry sheet = spreadsheetByName(fileName);
    List<List<String>> data = listAnnaliesjes(sheet);
    parseExport(data, leagueNightToProcess);
  }


  private List<List<String>> listAnnaliesjes(SpreadsheetEntry spreadsheet) throws Exception {

    List<List<String>> data = new ArrayList<>();

    WorksheetEntry worksheet = worksheetByName(spreadsheet, sheetTitle);

    if (worksheet != null) {

      int numCols = Arrays.asList(columns).size() + Arrays.asList(playerNames).size() * 2;

      ListFeed rows = spreadsheetService.getFeed(worksheet.getListFeedUrl(), ListFeed.class);
      int curCol = 0;

      ListEntry headerRow = rows.getEntries().get(0);
      List<String> columnHeadings = new ArrayList<>();
      for (String columnHeading : headerRow.getCustomElements().getTags()) {
        if (curCol == numCols) {
          break;
        }
        columnHeadings.add(columnHeading);
        curCol++;
      }
      data.add(columnHeadings);

      List<String> cells;

      for (ListEntry row : rows.getEntries()) {
        boolean isFirstCell = true;
        boolean includeLine = true;
        cells = new ArrayList<>();
        curCol = 0;
        for (String tag : row.getCustomElements().getTags()) {
          String value = row.getCustomElements().getValue(tag);
          if (isFirstCell) {
            isFirstCell = false;
            if (value == null) {
              includeLine = false;
              break;
            }
          }
          if (curCol == numCols) {
            break;
          }
          cells.add(value);
          curCol++;
        }

        if (includeLine) {
          data.add(cells);
        }
      }
    } else {

      LOG.debug("Spreadsheet " + spreadsheet.getTitle() + " has no worksheet titled " + sheetTitle);
    }

    return data;
  }


  @Override
  public List<Integer> getUnprocessedAnnaliesjes() {
    return super.getUnprocessedAnnaliesjes();
  }


  private SpreadsheetEntry spreadsheetByName(String spreadsheetTitle) throws IOException, ServiceException {
    SpreadsheetEntry foundSpreadsheetEntry = null;
    URL baseUrl = new URL(SPREADSHEET_FEED_URL);
    SpreadsheetFeed spreadsheetEntryFeed = spreadsheetService.getFeed(baseUrl, SpreadsheetFeed.class);
    List<SpreadsheetEntry> spreadsheets = spreadsheetEntryFeed.getEntries();
    for (SpreadsheetEntry spreadsheet : spreadsheets) {
      LOG.debug("  " + spreadsheet.getTitle().getPlainText());
      if (spreadsheet.getTitle().getPlainText().startsWith(spreadsheetTitle)) {
        foundSpreadsheetEntry = spreadsheet;
        break;
      }
    }
    return foundSpreadsheetEntry;
  }


  private WorksheetEntry worksheetByName(SpreadsheetEntry spreadsheet, String sheetTitle) throws IOException, ServiceException {
    WorksheetEntry foundWorksheetEntry = null;
    WorksheetFeed worksheetFeed = spreadsheetService.getFeed(spreadsheet.getWorksheetFeedUrl(), WorksheetFeed.class);
    List<WorksheetEntry> worksheets = worksheetFeed.getEntries();
    for (WorksheetEntry worksheet : worksheets) {
      LOG.debug("  " + worksheet.getTitle().getPlainText());
      if (worksheet.getTitle().getPlainText().startsWith(sheetTitle)) {
        foundWorksheetEntry = worksheet;
        break;
      }
    }
    return foundWorksheetEntry;
  }


  private List<WorksheetEntry> listWorksheets(SpreadsheetEntry spreadsheet) throws IOException, ServiceException {
    WorksheetFeed worksheetFeed = spreadsheetService.getFeed(spreadsheet.getWorksheetFeedUrl(), WorksheetFeed.class);
    List<WorksheetEntry> worksheets = worksheetFeed.getEntries();
    for (WorksheetEntry worksheet : worksheets) {
      LOG.debug("  " + worksheet.getTitle().getPlainText());
    }
    return worksheets;
  }


  private SpreadsheetEntry retrieveSpreadsheet(String fileId) throws IOException, ServiceException {
    String spreadsheetURL = SPREADSHEET_BASE_URL + fileId;
    return spreadsheetService.getEntry(new URL(spreadsheetURL), SpreadsheetEntry.class);
  }


  private void addData(SpreadsheetEntry spreadsheet) throws IOException, ServiceException {
    WorksheetFeed worksheetFeed = spreadsheetService.getFeed(spreadsheet.getWorksheetFeedUrl(), WorksheetFeed.class);
    List<WorksheetEntry> worksheets = worksheetFeed.getEntries();
    WorksheetEntry worksheet = worksheets.get(0);
    URL cellFeedUrl = worksheet.getCellFeedUrl();
    CellFeed cellFeed = spreadsheetService.getFeed(cellFeedUrl, CellFeed.class);
    CellEntry cellEntry = new CellEntry(1, 1, "aa");
    cellFeed.insert(cellEntry);
  }

}
