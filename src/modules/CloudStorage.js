import { gSettings } from '../class/Globals';
import { shared } from '../class/Shared';
import { DropboxStorage } from '../class/DropboxStorage';
import { GoogleDriveStorage } from '../class/GoogleDriveStorage';
import { OneDriveStorage } from '../class/OneDriveStorage';
import { ButtonSet } from '../class/ButtonSet';
import { Checkbox } from '../class/Checkbox';
import { Popup } from '../class/Popup';

class CloudStorage {
  static get DROPBOX() { return 0; }
  static get GOOGLEDRIVE() { return 1; }
  static get ONEDRIVE() { return 2; }

  static async manage(service, data, dm, callback) {
    if (dm.type === `export` || (data && gSettings.exportBackup)) {
      await CloudStorage.backup(service, data, dm, callback);
    } else {
      await CloudStorage.restore(service, dm, callback);
    }
  }

  static async backup(service, data, dm, callback) {
    const defaultFileName = `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
    const fileName = gSettings.askFileName ? window.prompt(`Enter the name of the file:`, defaultFileName) : defaultFileName;

    if (fileName === null) {
      if (callback) {
        callback();
      }
      return;
    }

    let token = null;

    switch (service) {
      case CloudStorage.DROPBOX:
        token = await DropboxStorage.authenticate();
        break;
      case CloudStorage.GOOGLEDRIVE:
        token = await GoogleDriveStorage.authenticate();
        break;
      case CloudStorage.ONEDRIVE:
        token = await OneDriveStorage.authenticate();
        break;
    }

    data = JSON.stringify(data);

    try {
      switch (service) {
        case CloudStorage.DROPBOX:
          await DropboxStorage.upload(token, data, fileName);
          break;
        case CloudStorage.GOOGLEDRIVE:
          await GoogleDriveStorage.upload(token, data, fileName);
          break;
        case CloudStorage.ONEDRIVE:
          await OneDriveStorage.upload(token, data, fileName);
          break;
      }

      if (gSettings.deleteOldBackups) {
        let files = null;

        try {
          switch (service) {
            case CloudStorage.DROPBOX:
              files = await DropboxStorage.list(token);
              break;
            case CloudStorage.GOOGLEDRIVE:
              files = await GoogleDriveStorage.list(token);
              break;
            case CloudStorage.ONEDRIVE:
              files = await OneDriveStorage.list(token);
              break;
          }

          const now = Date.now();
          const fileIds = [];
          for (const file of files) {
            if (now - new Date(file.date).getTime() > gSettings.deleteOldBackups_days * 86400000) {
              fileIds.push(file.id);
            }
          }
          const numFiles = fileIds.length;

          try {
            let result = null;

            switch (service) {
              case CloudStorage.DROPBOX:
                result = await DropboxStorage.deleteBatch(token, fileIds);
                break;
              case CloudStorage.GOOGLEDRIVE:
                result = await GoogleDriveStorage.deleteBatch(token, fileIds);
                break;
              case CloudStorage.ONEDRIVE:
                result = await OneDriveStorage.deleteBatch(token, fileIds);
                break;
            }

            const numError = result.error.length;
            if (numError > 0) {
              window.alert(`An error occurred when deleting ${numError} of the ${numFiles} old backup files.`);
              if (callback) {
                callback();
              }
              return;
            }
          } catch (error) {
            window.alert(`An error occurred when deleting the ${numFiles} old backup files.\n\n${error.message}`);
            if (callback) {
              callback();
            }
            return;
          }
        } catch (error) {
          window.alert(`An error occurred when listing the old backup files.\n\n${error.message}`);
          if (callback) {
            callback();
          }
          return;
        }
      }

      if (!dm.autoBackup) {
        shared.common.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
      }
    } catch (error) {
      window.alert(`An error occurred when uploading the file.\n\n${error.message}`);
    }

    if (callback) {
      callback();
    }
  }

  static async restore(service, dm, callback) {
    let icon = null;
    let token = null;

    switch (service) {
      case CloudStorage.DROPBOX:
        icon = `dropbox`;
        token = await DropboxStorage.authenticate();
        break;
      case CloudStorage.GOOGLEDRIVE:
        icon = `google`;
        token = await GoogleDriveStorage.authenticate();
        break;
      case CloudStorage.ONEDRIVE:
        icon = `windows`;
        token = await OneDriveStorage.authenticate();
        break;
    }

    let isCanceled = true;

    const popup = new Popup({
      addScrollable: true,
      icon: `fa-${icon}`,
      isTemp: true,
      title: `Select a file to restore:`
    });
    popup.onClose = () => {
      if (isCanceled && callback) {
        callback();
      }
    };
    popup.open();

    const filesContainer = shared.common.createElements_v2(popup.scrollable, `beforeEnd`, [
      [`div`, { class: `popup__keys__list` }]
    ]);

    let files = null;

    try {
      switch (service) {
        case CloudStorage.DROPBOX:
          files = await DropboxStorage.list(token);
          break;
        case CloudStorage.GOOGLEDRIVE:
          files = await GoogleDriveStorage.list(token);
          break;
        case CloudStorage.ONEDRIVE:
          files = await OneDriveStorage.list(token);
          break;
      }
    } catch (error) {
      window.alert(`An error occurred when listing the files.\n\n${error.message}`);
      if (callback) {
        callback();
      }
      return;
    }

    let selectedFiles = {};

    for (const file of files) {
      const item = shared.common.createElements_v2(filesContainer, `beforeEnd`, [
        [`div`, { class: `esgst-clickable esgst-restore-entry` }, [
          [`span`],
          [`span`, `${file.name} - ${shared.common.convertBytes(file.size)}`],
          [`i`, { class: `fa fa-times-circle`, title: `Delete file` }]
        ]]
      ]);
      const checkbox = new Checkbox(item.firstElementChild);
      checkbox.onEnabled = () => selectedFiles[file.id] = { item };
      checkbox.onDisabled = () => delete selectedFiles[file.id];
      item.firstElementChild.nextElementSibling.addEventListener(`click`, () => {
        shared.common.createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
          isCanceled = false;

          popup.close();

          try {
            switch (service) {
              case CloudStorage.DROPBOX:
                dm.data = await DropboxStorage.download(token, file);
                break;
              case CloudStorage.GOOGLEDRIVE:
                dm.data = await GoogleDriveStorage.download(token, file);
                break;
              case CloudStorage.ONEDRIVE:
                dm.data = await OneDriveStorage.download(token, file);
                break;
            }

            dm.data = JSON.parse(dm.data);
          } catch (error) {
            window.alert(`An error occurred when downloading the file.\n\n${error.message}`);
            if (callback) {
              callback();
            }
            return;            
          }
            
          shared.esgst.modules.manageData(dm, false, false, false, false, callback);
        });
      });
      item.lastElementChild.addEventListener(`click`, () => {
        shared.common.createConfirmation(`WARNING: Are you sure you want to delete this file?`, async () => {
          const tempPopup = new Popup({
            icon: `fa-circle-o-notch fa-spin`,
            isTemp: true,
            title: `Deleting file...`
          });
          tempPopup.open();

          try {
            switch (service) {
              case CloudStorage.DROPBOX:
                await DropboxStorage.delete(token, file);
                break;
              case CloudStorage.GOOGLEDRIVE:
                await GoogleDriveStorage.delete(token, file);
                break;
              case CloudStorage.ONEDRIVE:
                await OneDriveStorage.delete(token, file);
                break;
            }

            tempPopup.setIcon(`fa-check`);
            tempPopup.setTitle(`File deleted with success!`);
          } catch (error) {
            tempPopup.setIcon(`fa-times`);
            tempPopup.setTitle(`An error occurred when deleting the file.\n\n${error.message}`);
          }
        });
      });
    }

    popup.popup.insertBefore(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-trash`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Delete selected files`,
      title2: `Deleting...`,
      callback1: () => {
        return new Promise(resolve => {
          const fileIds = Object.keys(selectedFiles);
          const numFiles = fileIds.length;

          if (numFiles < 1) {
            resolve();
            return;
          }

          shared.common.createConfirmation(`WARNING: Are you sure you want to delete the selected files?`, async () => {
            const tempPopup = new Popup({
              icon: `fa-circle-o-notch fa-spin`,
              isTemp: true,
              title: `Deleting ${numFiles} files...`
            });
            tempPopup.open();

            try {
              let result = null;

              switch (service) {
                case CloudStorage.DROPBOX:
                  result = await DropboxStorage.deleteBatch(token, fileIds);
                  break;
                case CloudStorage.GOOGLEDRIVE:
                  result = await GoogleDriveStorage.deleteBatch(token, fileIds);
                  break;
                case CloudStorage.ONEDRIVE:
                  result = await OneDriveStorage.deleteBatch(token, fileIds);
                  break;
              }

              for (const fileId of result.success) {
                if (!selectedFiles.hasOwnProperty(fileId)) {
                  continue;
                }
                selectedFiles[fileId].item.remove();
              }

              const numError = result.error.length;
              if (numError > 0) {
                tempPopup.setIcon(`fa-times`);
                tempPopup.setTitle(`An error occurred when deleting ${numError} of the ${numFiles} files.`);
              } else {
                tempPopup.setIcon(`fa-check`);
                tempPopup.setTitle(`${numFiles} files deleted with success!`);
              }
            } catch (error) {
              tempPopup.setIcon(`fa-times`);
              tempPopup.setTitle(`An error occurred when deleting the ${numFiles} files.\n\n${error.message}`);
            }

            resolve();
          }, resolve)
        });
      }
    }).set, popup.actions);
  }
}

export { CloudStorage };