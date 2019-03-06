package poc;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.evernote.auth.EvernoteAuth;
import com.evernote.auth.EvernoteService;
import com.evernote.clients.ClientFactory;
import com.evernote.clients.NoteStoreClient;
import com.evernote.clients.UserStoreClient;
import com.evernote.edam.error.EDAMErrorCode;
import com.evernote.edam.error.EDAMSystemException;
import com.evernote.edam.error.EDAMUserException;
import com.evernote.edam.notestore.NoteFilter;
import com.evernote.edam.notestore.NoteList;
import com.evernote.edam.type.Note;
import com.evernote.edam.type.NoteSortOrder;
import com.evernote.edam.type.Notebook;
import com.evernote.thrift.transport.TTransportException;


public class EvernoteSyncServiceImpl implements EvernoteSyncService {

  private static final Log LOG = LogFactory.getLog(EvernoteSyncServiceImpl.class);

  private static final String AUTH_TOKEN =
      "S=s2:U=73f79:E=152ae3f5e29:C=14b568e3030:P=1cd:A=en-devtoken:V=2:H=b1d38f0d9707794532dbb049a6c0e305";

  private UserStoreClient userStore;
  private NoteStoreClient noteStore;


  public EvernoteSyncServiceImpl(String token) throws Exception {

    // Set up the UserStore client and check that we can speak to the server
    EvernoteAuth evernoteAuth = new EvernoteAuth(EvernoteService.PRODUCTION, token);
    ClientFactory factory = new ClientFactory(evernoteAuth);
    userStore = factory.createUserStoreClient();

    boolean versionOk = userStore.checkVersion("EvernoteClient", com.evernote.edam.userstore.Constants.EDAM_VERSION_MAJOR,
        com.evernote.edam.userstore.Constants.EDAM_VERSION_MINOR);
    if (!versionOk) {
      System.err.println("Incompatible Evernote client protocol version");
      System.exit(1);
    }
    // Set up the NoteStore client
    noteStore = factory.createNoteStoreClient();
  }


  @Override
  public void downloadAllNotes() {

  }


  @Override
  public void downloadNotebook(String notebookName) {
  }


  private List<Note> listAllNotes() throws Exception {

    // List the notes in the user's account
    LOG.debug("Listing all notes for current user");

    List<Note> notes = new ArrayList<>();

    // First, get a list of all notebooks
    List<Notebook> notebooks = noteStore.listNotebooks();

    for (Notebook notebook : notebooks) {
      LOG.debug(String.format("Adding notes from notebook \"%s\"", notebook.getName()));
      notes.addAll(listNotesInNotebook(notebook.getName()));
    }
    return notes;
  }


  private List<Note> listNotesInNotebook(String notebookName) throws Exception {

    // List the notes in the user's account
    LOG.debug(String.format("Listing all notes in notebook \"%s\"", notebookName));

    List<Note> notes = new ArrayList<>();
    try {

      Notebook notebook = getNotebookByName(notebookName);
      assert (notebook != null);

      notes = listNotesInNotebook(notebook);

    }
    catch (EDAMUserException e) {

      // These are the most common error types that you'll need to handle
      // EDAMUserException is thrown when an API call fails because a paramter was invalid.

      if (e.getErrorCode() == EDAMErrorCode.AUTH_EXPIRED) {
        LOG.error("Your authentication token is expired!");
      }
      else if (e.getErrorCode() == EDAMErrorCode.INVALID_AUTH) {
        LOG.error("Your authentication token is invalid!");
      }
      else if (e.getErrorCode() == EDAMErrorCode.QUOTA_REACHED) {
        LOG.error("Your authentication token is invalid!");
      }
      else {
        LOG.error("Error: " + e.getErrorCode().toString() + " parameter: " + e.getParameter());
      }
    }
    catch (EDAMSystemException e) {
      LOG.error("System error: " + e.getErrorCode().toString());
    }
    catch (TTransportException t) {
      LOG.error("Networking error: " + t.getMessage());
    }
    return notes;
  }


  private List<Note> listNotesInNotebook(Notebook notebook) throws Exception {

    NoteFilter filter = new NoteFilter();
    filter.setNotebookGuid(notebook.getGuid());
    filter.setOrder(NoteSortOrder.CREATED.getValue());
    filter.setAscending(true);

    NoteList noteList = noteStore.findNotes(filter, 0, 20);
    List<Note> notes = noteList.getNotes();

    for (Note note : notes) {

      Date dateCreated = new Date(note.getCreated());
      SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");

      LOG.info(" * " + dateFormatter.format(dateCreated) + " " + note.getTitle() + " (" + note.getGuid() + ")");

      // Note fullNote = noteStore.getNote(note.getGuid(), true, true, false, false);
      // System.out.println(fullNote.getContent());

    }
    return notes;
  }


  private Notebook getNotebookByName(String notebookName) throws Exception {
    List<Notebook> notebooks = noteStore.listNotebooks();
    for (Notebook notebook : notebooks) {
      if (notebookName.equals(notebook.getName())) {
        LOG.debug(String.format("Notebook \"%s\" found", notebook.getName()));
        return notebook;
      }
    }
    return null;
  }

}
