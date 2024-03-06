<template>
  <label :for="currentId" class="custom-file-upload">
    <i></i><font-awesome-icon icon="fa-solid fa-camera" /> {{ buttonText }}
  </label>
  <input :id="currentId" type="file" accept="image/*,video/*" ref="upload" @change="uploadImage" />
</template>


<script setup lang="ts">

import { createClient } from "webdav";
import { imageServerConfig } from "../../imageServerConfig";
import { useWidgetsStore, WidgetValue } from "@/common/stores";
import type { Widget } from "../config.d.ts";
import { Buffer } from "buffer";

// register the widget with the store
const props = defineProps<{
  data: Widget,
  currentId: string
}>();

let buttonText: string = $ref("Take Picture");
let imageRawBase64: string;
let imageCorrectedBase64: string | undefined;
let imageBinary: Buffer;
let successfulFileNames = $ref("");
// there could be multiple files uploaded, so we need to keep track of all of them and separate them with a comma

// set widget's value ref to the file name(s) on the server for the database to record when data is submitted
useWidgetsStore().addWidgetValue(props.data, $$(successfulFileNames));

// create a client to connect to a WebDAV server (in our case, Nextcloud)
const client = createClient(
  imageServerConfig.server,
  {
    username: imageServerConfig.username,
    password: imageServerConfig.password // this is a configured app password named "WebDAV-Testing"
  }
);

// called when the user takes/selects a image to upload, then uploads the image to the server
function uploadImage(e: any) {
  // get the widget name of the one that was clicked if there are multiple on the page
  const pictureContext = props.data.name?.toLowerCase().replace(" ", "-");
  // grab widget values from the store that correspond to this session
  const instanceWidgetStores: Array<WidgetValue> = useWidgetsStore().values;
  const scouterName: string | undefined = instanceWidgetStores.find((widget: WidgetValue) => widget.name === "scouter_name")?.value.toString();
  const teamNumber: string | undefined = instanceWidgetStores.find((widget: WidgetValue) => widget.name === "team_number")?.value.toString();
  const uuid: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // create file name using scouter name, team number, and a random uuid to make sure the file name is unique when multiple photos are taken
  let fileName = `${scouterName}_${teamNumber}_${pictureContext}_${uuid}`;
  if (!scouterName) {
    console.log("Scouter name not found in stores, probably wasn't entered yet");
    buttonText = "Failure: no scouter name";
    // change text back to normal after 4 seconds
    setTimeout(() => {
      buttonText = "Take Picture";
    }, 4000);
    return;
  }
  if (!teamNumber || teamNumber === "0") {
    console.log("Team number not found in stores, probably wasn't entered yet");
    buttonText = "Failure: no team number";
    // change text back to normal after 4 seconds
    setTimeout(() => {
      buttonText = "Take Picture";
    }, 4000);
    return;
  }
  const buttonTextPrev = buttonText;
  buttonText = "Uploading...";
  const image = e.target.files[0];
  if (!image) {
    buttonText = buttonTextPrev;
    return; // no image was selected or taken, just a button click (user cancelled probably)
  }
  console.log(`File collected from user: ${image.name}`);
  // add file extension to file name (e.g: .png, .jpg, etc.)
  fileName += `.${image.name.split(".").pop()}`;
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = async (e: any) => {
    try {
      imageRawBase64 = e.target.result;
      // remove the metadata from the beginning of the base64 string, ex: data:image/png;base64,
      imageCorrectedBase64 = imageRawBase64.split(",").pop();
      if (!imageCorrectedBase64) {
        console.log("Issue with base64 encoding, raw base64 below:");
        console.log(imageRawBase64);
        buttonText = "Failure.. try again";
        setTimeout(() => {
          buttonText = buttonTextPrev;
        }, 4000);
        return;
      }
      // convert to buffer
      imageBinary = Buffer.from(imageCorrectedBase64, "base64");
      const result = await client.putFileContents(fileName, imageBinary, {
        onUploadProgress: (progress: any) => {
          // get upload progress as percentage and update button text as upload progresses
          const percentage = Math.round((progress.loaded * 100) / progress.total);
          console.log(`Uploaded ${percentage}%`);
          console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
          if (percentage === 100) {
            buttonText = `Uploading... ${percentage}%`;
            setTimeout(() => {
              buttonText = "Processing on server...";
            }, 1000);
          }
          else {
            buttonText = `Uploading... ${percentage}%`;
          }
        },
        overwrite: true
      });

      // if the upload was successful, add the file name to the list of successful file names
      if (result) {
        if (successfulFileNames.length > 0) {
          successfulFileNames += "," + fileName;
        }
        else {
          successfulFileNames += fileName;
        }
      }

      console.log(`Upload result ${result ? "success!\nFile name on server is: " + fileName : "failure"}`);
      buttonText = result ? "Success!" : "Failure.. Try again";
      setTimeout(() => {
        if (result) {
          buttonText = "Take Another";
        }
        else {
          buttonText = buttonTextPrev;
        }
      }, 3000);
    }
    catch (e) {
      console.error(e);
      buttonText = "Failure.. Try again";
      setTimeout(() => {
        buttonText = buttonTextPrev;
      }, 4000);
    }
  };
}

</script>


<style>
input[type="file"] {
  display: none;
}

.custom-file-upload {
  border: 2px solid;
  border-color: #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px;
}
</style>
