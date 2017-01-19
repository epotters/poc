package nl.abz.os;


import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.Vector;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


public class HtmlGenerator {
  public static final String MODE_WEBAPP = "webapp";
  public static final String MODE_WHITE_LABEL = "whiteLabel";
  public static final String MODE_APP = "phonegap";
  private static final Log LOG = LogFactory.getLog(HtmlGenerator.class);
  private static final String INDEX_VAR_CACHE_MANIFEST = "${cacheManifest}";
  private static final String INDEX_VAR_MIN_JS = "${minJs}";
  private static final String INDEX_VAR_VERSION = "${version}";
  private static final String INDEX_VAR_BASE_URL = "${baseUrl}";
  private static final String INDEX_VAR_PAGE_BASE_URL = "${pageBaseUrl}";
  private static final String INDEX_VAR_PAGE_SRC = "${src}";
  private static final String INDEX_VAR_BODY_CLASS = "${bodyClass}";
  private static final String INDEX_VAR_JQUERY_VERSION = "${jquery.version}";
  private static final String INDEX_VAR_JQUERY_VALIDATION_VERSION = "${jquery.validation.version}";
  private static final String INDEX_VAR_JQUERY_MOBILE_VERSION = "${jquery.mobile.version}";
  private static final String INDEX_VAR_CORDOVA_VERSION = "${cordova.version}";

  private static final String IF_DEF_BEGIN = "#ifdef $";
  private static final String IF_NOT_DEF_BEGIN = "#ifnotdef $";
  private static final String IF_DEF_END = "#endif";

  private static final String PAGE_VAR_PAGE_NAME = "${page.name}";
  private static final String PAGE_VAR_PAGE_TITLE = "${page.title}";
  private static final String PAGE_VAR_PAGE_TYPE = "${page.type}";
  private static final String PAGE_VAR_PAGE_CONTENT = "${page.content}";
  private static final String PAGE_VAR_PAGE_STATUS = "${page.statusHtml}";
  private static final String PAGE_VAR_NEXT_PAGE_TITLE = "${nextPage.title}";

  private static final String NGVA_VAR_PAGE_TITLE = "${pageTitle}";
  private static final String NGVA_VAR_BASE_URL = "${baseUrl}";
  private static final String NGVA_VAR_LOGO_SRC = "${logoSrc}";
  private static final String NGVA_VAR_INTRO_SRC = "${introSrc}";

  private static final String DEELNEMERS_VAR_PAGE_CONTENT = "${page.content}";

  private Properties properties;


  public HtmlGenerator() throws IOException {
    properties = new Properties();
    URL url = HtmlGenerator.class.getClassLoader().getResource("defjam.properties");
    properties.load(url.openStream());
  }


  private boolean debugMode() {
    return StringUtils.equals(properties.getProperty("debug"), "true");
  }


  private boolean cacheEnabled() {
    return !StringUtils.equals(properties.getProperty("cache"), "false");
  }


  private String version() {
    return properties.getProperty("version");
  }


  private String build() {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");

    return "build " + sdf.format(Calendar.getInstance().getTime());
  }


  private File pageTemplateSource() {
    return new File(properties.getProperty("pageTemplateSource"));
  }


  private File pageContentSource() {
    return new File(properties.getProperty("pageContentSource"));
  }


  private File indexTemplateFile() {
    return new File(properties.getProperty("indexTemplate"));
  }


  private String indexTargetFolder() {
    return properties.getProperty("indexTarget");
  }


  private File whiteLabelSourceFolder() {
    return new File(properties.getProperty("whiteLabelSource"));
  }


  private String whiteLabelTargetFolder() {
    return properties.getProperty("whiteLabelTarget");
  }


  private File nvgaTemplateFile() {
    return new File(properties.getProperty("nvgaTemplate"));
  }


  private File nvgaListTemplateFile() {
    return new File(properties.getProperty("nvgaListTemplate"));
  }


  private File nvgaSourceFolder() {
    return new File(properties.getProperty("nvgaSource"));
  }


  private String nvgaTargetFolder() {
    return properties.getProperty("nvgaTarget");
  }


  private String deelnemersSourceFolder() {
    return properties.getProperty("deelnemersSource");
  }


  private String deelnemersTargetFolder() {
    return properties.getProperty("deelnemersTarget");
  }


  private String deelnemersTemplate() {
    return properties.getProperty("deelnemersTemplate");
  }


  private String jqueryVersion() {
    return properties.getProperty("jquery.version");
  }


  private String jqueryValidationVersion() {
    return properties.getProperty("jquery.validation.version");
  }


  private String jqueryMobileVersion() {
    return properties.getProperty("jquery.mobile.version");
  }


  private String cordovaVersion() {
    return properties.getProperty("cordova.version");
  }


  public void buildIndex(String mode, String targetFileName) throws IOException {
    LOG.info("mode:" + mode);
    LOG.info("version=" + version() + " " + build());
    LOG.info("debug=" + debugMode());
    LOG.info("cache=" + cacheEnabled());

    String indexTemplate = FileUtils.readFileToString(indexTemplateFile());

    String cacheManifest = "";

    if (cacheEnabled()) {
      cacheManifest = " manifest=\"cache.manifest\"";
    }

    String minJs = ".min";

    if (debugMode()) {
      minJs = "";
    }

    String version = version() + " " + build();
    String baseUrl = ".";
    String pageBaseUrl = ".";
    String pageSrc = mergePages(mode);
    String bodyClass = "";

    if (isWhiteLabelMode(mode)) {
      bodyClass = "white-label-app";
    }

    String searchList[] = new String[] {INDEX_VAR_CACHE_MANIFEST, INDEX_VAR_MIN_JS, INDEX_VAR_VERSION, INDEX_VAR_BASE_URL,
        INDEX_VAR_PAGE_BASE_URL, INDEX_VAR_PAGE_SRC, INDEX_VAR_BODY_CLASS, INDEX_VAR_JQUERY_VERSION,
        INDEX_VAR_JQUERY_VALIDATION_VERSION, INDEX_VAR_JQUERY_MOBILE_VERSION, INDEX_VAR_CORDOVA_VERSION};
    String replacementList[] =
        new String[] {cacheManifest, minJs, version, baseUrl, pageBaseUrl, pageSrc, bodyClass, jqueryVersion(),
            jqueryValidationVersion(), jqueryMobileVersion(), cordovaVersion()};
    indexTemplate = StringUtils.replaceEach(indexTemplate, searchList, replacementList);

    indexTemplate = checkIfDef(indexTemplate, "debug", debugMode());
    indexTemplate = checkIfDef(indexTemplate, MODE_APP, isAppMode(mode));
    indexTemplate = checkIfDef(indexTemplate, MODE_WHITE_LABEL, isWhiteLabelMode(mode));
    indexTemplate = checkIfDef(indexTemplate, MODE_WEBAPP, isWebAppMode(mode));

    File indexFile = new File(indexTargetFolder(), targetFileName);
    FileUtils.writeStringToFile(indexFile, indexTemplate);
    LOG.info("index target:" + indexFile);
  }


  protected boolean isAppMode(String mode) {
    return StringUtils.equals(MODE_APP, mode);
  }


  protected boolean isWebAppMode(String mode) {
    return StringUtils.equals(MODE_WEBAPP, mode);
  }


  protected boolean isNotWhiteLabelMode(String mode) {
    return !isWhiteLabelMode(mode);
  }


  protected boolean isWhiteLabelMode(String mode) {
    return StringUtils.equals(MODE_WHITE_LABEL, mode);
  }


  private String mergePages(String mode) throws IOException {
    String pageSrc = "";
    Vector<Page> pages = new Vector<Page>();

    pages.add(new Page("p00-welkom", "Mobielschademelden.nl", 0, false, "home", "form", "plain"));
    pages.add(new Page("p00-introductie", "Introductie", 0, false, null, "form", "form"));
    pages.add(new Page("p01-situatie-inschatten", "Situatie", 1, true, null, "form", "form"));
    pages.add(new Page("p02-meldende-partij", "Meldende partij", 2, true, null, "form", "form"));
    pages.add(new Page("p03-wederpartij", "Wederpartij", 3, isNotWhiteLabelMode(mode), null, "form", "form"));
    pages.add(new Page("p04-locatie-tijd-bijzonderheden", "Locatie", 4, true, null, "form", "form"));
    pages.add(new Page("p05-toedracht", "Situatie", 5, true, null, "form", "form"));
    pages.add(new Page("p06-samenvatting", "Samenvatting", 6, true, null, "form", "form"));
    pages.add(new Page("p07-akkoordverklaring", "Akkoordverklaring", 7, true, null, "form", "form"));
    pages.add(new Page("een-ogenblik-geduld", "Een ogenblik geduld", null, false, null, "message", "dialog"));
    pages.add(
        new Page("mobiel-schade-melden-niet-mogelijk", "Mobiel schade melden is niet mogelijk", null, false, null, "message",
            "exit"));
    pages.add(new Page("schademelding-verzonden", "Schademelding verzonden", null, false, null, "message", "plain"));
    pages.add(new Page("schademelding-verzonden-WBF1", "Schademelding verzonden", null, false, null, "message", "plain"));
    pages.add(new Page("schademelding-verzonden-WBF2", "Schademelding verzonden", null, false, null, "message", "plain"));
    pages.add(new Page("schademelding-verzonden-WBF4", "Schademelding verzonden", null, false, null, "message", "plain"));
    pages.add(new Page("schademelding-verzonden-WBF5", "Schademelding verzonden", null, false, null, "message", "plain"));

    if (isWhiteLabelMode(mode)) {
      pages.add(new Page("white-label-niet-mogelijk", "Ga naar Mobielschademelden.nl", null, false, null, "message", "dialog"));
    }

    if (debugMode()) {
      pages.add(new Page("debug-info", "Debug information", null, false, null, "message", "plain"));
    }

    for (int index = 0; index < pages.size(); index++) {
      Page page = pages.get(index);
      File template = new File(pageTemplateSource(), page.getTemplate() + "-template.html");
      String pageTemplate = FileUtils.readFileToString(template);

      File content = new File(pageContentSource(), page.getName() + ".html");
      String pageContent = FileUtils.readFileToString(content);

      String nextPageTitle = (index < pages.size() - 1 ? pages.get(index + 1).getTitle() : "");

      String pageStatus = createStatus(pages, index);

      String searchList[] = new String[] {PAGE_VAR_PAGE_NAME, PAGE_VAR_PAGE_TITLE, PAGE_VAR_PAGE_TYPE, PAGE_VAR_NEXT_PAGE_TITLE,
          PAGE_VAR_PAGE_STATUS, PAGE_VAR_PAGE_CONTENT};
      String replacementList[] =
          new String[] {page.getName(), page.getTitle(), page.getType(), nextPageTitle, pageStatus, pageContent};

      pageSrc += StringUtils.replaceEach(pageTemplate, searchList, replacementList);
    }

    return pageSrc;
  }


  private String createStatus(Vector<Page> pages, int currentPageIndex) {
    boolean currentPageFound = false;
    String status = "";

    for (int index = 0; index < pages.size(); index++) {
      Page page = pages.get(index);

      if (page.isInOverview()) {
        String url = "#" + page.getName();
        String className = "status-complete";
        String dataIcon = "check";
        String dataTheme = "c";

        if (currentPageFound) {
          url = "#";
          className = "status-incomplete";
          dataTheme = "d";
          dataIcon = "arrow-r";
        }

        if (StringUtils.isNotBlank(page.getIcon())) {
          dataIcon = page.getIcon();
        }

        if (currentPageIndex == index) {
          className = "status-current";
          dataTheme = "b";
          dataIcon = "star";
          currentPageFound = true;
        }

        status += "<a href=\"" + url + "\" data-role=\"button\" data-icon=\"" + dataIcon + "\" "
            + "data-iconpos=\"notext\" data-theme=\"" + dataTheme + "\" class=\"status " + page.getName() + "-status\" "
            + "title=\"" + page.getTitle() + "\">" + page.getTitle() + "</a>\n";
      }
    }

    return status;
  }


  private String checkIfDef(String text, String var, boolean keep) {
    text = loopDef(text, IF_DEF_BEGIN + var, keep);
    text = loopDef(text, IF_NOT_DEF_BEGIN + var, !keep);

    return text;
  }


  private String loopDef(String text, String varDef, boolean keep) {
    int varStartPos = StringUtils.indexOf(text, varDef);
    LOG.info(varDef + ":" + varStartPos + ":");

    if (varStartPos == -1) {
      return text;
    }

    int varEndPos = StringUtils.indexOf(text, IF_DEF_END, varStartPos);
    LOG.info(varDef + ":" + varEndPos + ":");

    String prefix = StringUtils.substring(text, 0, varStartPos);
    String suffix = "";

    if (keep) {
      suffix = StringUtils.substring(text, varStartPos + StringUtils.length(varDef), varEndPos);
    }

    String postfix = StringUtils.substring(text, varEndPos + StringUtils.length(IF_DEF_END));

    return StringUtils.join(new String[] {prefix, suffix, postfix});
  }


  public void buildWhiteLabels() throws IOException {
    LOG.info("white label source=" + whiteLabelSourceFolder());
    LOG.info("white label target=" + whiteLabelTargetFolder());

    IOFileFilter whiteLabelCSSFileFilter = new IOFileFilter() {
      @Override()
      public boolean accept(File file) {
        return accept(file.getParentFile(), file.getName());
      }


      @Override()
      public boolean accept(File dir, String name) {
        return StringUtils.equals("white-label.css", name);
      }
    };

    Iterator<File> whiteLabelCSSFilesIterator =
        FileUtils.iterateFiles(nvgaSourceFolder(), whiteLabelCSSFileFilter, TrueFileFilter.INSTANCE);

    for (; whiteLabelCSSFilesIterator.hasNext(); ) {
      File whiteLabelCSSFile = whiteLabelCSSFilesIterator.next();
      File profileFolder = whiteLabelCSSFile.getParentFile();
      String profileName = profileFolder.getName();

      buildIndex(MODE_WHITE_LABEL, profileName + ".html");
    }
  }


  public void buildIntros() throws IOException {
    LOG.info("NVGA source=" + nvgaSourceFolder());
    LOG.info("NVGA target=" + nvgaTargetFolder());

    IOFileFilter nvgaIntroFileFilter = new IOFileFilter() {
      @Override()
      public boolean accept(File file) {
        return accept(file.getParentFile(), file.getName());
      }


      @Override()
      public boolean accept(File dir, String name) {
        return StringUtils.equals("intro.html", name);
      }
    };

    Iterator<File> introFilesIterator =
        FileUtils.iterateFiles(nvgaSourceFolder(), nvgaIntroFileFilter, TrueFileFilter.INSTANCE);
    String profileList = "";

    for (; introFilesIterator.hasNext(); ) {
      profileList += createNVGAIntroIndex(introFilesIterator.next());
    }

    createNVGAList(profileList);
  }


  /**
   * Builds a static deelnemers page html
   *
   * @throws IOException
   */
  public void buildDeelnemers() throws IOException {
    LOG.info("Deelnemers source=" + deelnemersSourceFolder());
    LOG.info("Deelnemers target=" + deelnemersTargetFolder());

    File deelnemersTemplate = new File(deelnemersTemplate());

    String deelnemersPage = FileUtils.readFileToString(deelnemersTemplate);

    List<String> profiles = new LinkedList<String>();

    File directory = new File(deelnemersSourceFolder());
    File[] files = directory.listFiles();

    for (int i = 0; i < files.length; i++) {

      File file = files[i];

      if (file.isDirectory()) {

        File profileJson = new File(file.getPath(), "profile.json");

        if (profileJson.canRead()) {

          JSONObject jsonObject;

          try {
            jsonObject = (JSONObject) new JSONParser().parse(FileUtils.readFileToString(profileJson));

            String profileName = (String) jsonObject.get("profiel-scherm-naam");
            if (StringUtils.isNotBlank(profileName) && !profiles.contains(profileName)) {
              profiles.add(profileName);
            }
          }
          catch (ParseException e) {
            LOG.error("Error parsing profile.json for folder: " + file.getName() + " in path: " + file.getPath());
          }
        }
      }
    }

    Collections.sort(profiles);

    // Build the HTML

    String prevAbc = "";
    String abc = "";
    String src = "";

    for (String profileName : profiles) {

      if (StringUtils.isNotBlank(profileName)) {

        abc = profileName.substring(0, 1);

        if (!abc.equals(prevAbc)) {
          src += "<div class=\"abc\"><a name=\"" + abc + "\">" + abc + "</a></div>\n";
        }

        src += "<div class=\"profile\">" + profileName + "</div><br />\n";
        prevAbc = abc;

      }
    }

    deelnemersPage = StringUtils.replace(deelnemersPage, DEELNEMERS_VAR_PAGE_CONTENT, src);

    File file = new File(deelnemersTargetFolder(), "deelnemers.html");

    FileUtils.writeStringToFile(file, deelnemersPage);

  }


  private String createNVGAIntroIndex(File profileIntroFile) throws IOException {
    File profileFolder = profileIntroFile.getParentFile();
    String profileName = profileFolder.getName();
    LOG.info("NVGA profile:" + profileName);
    LOG.info("NVGA template:" + nvgaTemplateFile());

    String pageTitle = "Intropagina";
    String baseUrl = "../";
    String logoUrl = "<div class=\"image\"><img src=\"" + baseUrl + "profiles/" + profileName + "/" + profileName + "-logo.png"
        + "\" /></div>\n";
    String introText = "<div class=\"intro-text\">" + FileUtils.readFileToString(profileIntroFile) + "</div>\n";
    String introTemplate = FileUtils.readFileToString(nvgaTemplateFile());

    String searchList[] = new String[] {NGVA_VAR_PAGE_TITLE, NGVA_VAR_BASE_URL, NGVA_VAR_LOGO_SRC, NGVA_VAR_INTRO_SRC};
    String replacementList[] = new String[] {pageTitle, baseUrl, logoUrl, introText};
    introTemplate = StringUtils.replaceEach(introTemplate, searchList, replacementList);

    File targetFolder = new File(nvgaTargetFolder(), profileName);
    FileUtils.forceMkdir(targetFolder);
    File introIndexFile = new File(targetFolder, "index.html");
    FileUtils.writeStringToFile(introIndexFile, introTemplate);
    LOG.info("NVGA target:" + introIndexFile);

    return "<li><a href=\"" + profileName + "/index.html\">" + profileName + "</a></li>\n";
  }


  private void createNVGAList(String profileList) throws IOException {
    String pageTitle = "NVGA";
    String baseUrl = "";
    String introText = "<div class=\"intro-list\"><ul>" + profileList + "</ul></div>\n";
    String nvgaListTemplate = FileUtils.readFileToString(nvgaListTemplateFile());

    String searchList[] = new String[] {NGVA_VAR_PAGE_TITLE, NGVA_VAR_BASE_URL, NGVA_VAR_INTRO_SRC};
    String replacementList[] = new String[] {pageTitle, baseUrl, introText};
    nvgaListTemplate = StringUtils.replaceEach(nvgaListTemplate, searchList, replacementList);

    File nvgaListFile = new File(nvgaTargetFolder(), "nvga.html");
    FileUtils.writeStringToFile(nvgaListFile, nvgaListTemplate);
    LOG.info("NVGA target:" + nvgaListFile);
  }
}
