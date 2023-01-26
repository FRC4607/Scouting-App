<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>

  <label :for="currentId" class="custom-file-upload">
    <i></i><font-awesome-icon icon="fa-solid fa-camera" /> {{ buttonText }}
  </label>
  <input :id="currentId" type="file" accept="image/*" ref="upload" @change="uploadImage" capture="environment" />

</template>


<script setup lang="ts">

import { createClient } from "webdav/web";
import { imageServerConfig } from "../../imageServerConfig";
import { useWidgetsStore, WidgetValue } from "@/common/stores";
import { WidgetData } from "@/common/types";
import { Buffer } from "buffer";

// register the widget with the store
const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();
const value = $ref("");
useWidgetsStore().addWidgetValue(props.data, $$(value));

let buttonText: string = $ref("Take Picture");
let imageRawBase64: string;
let imageCorrectedBase64: string;
let imageBinary: Buffer;

// create a client to connect to the Nextcloud WebDAV server
const client = createClient(
  imageServerConfig.server,
  {
    username: imageServerConfig.username,
    password: imageServerConfig.password // this is a configured app password named "WebDAV-Testing"
  }
);

// called when the user takes/selects a image to upload, then uploads the image to the server
function uploadImage(e: any) {
  // figure out which button was clicked (battery area or the robot, 3-2 is the first, 3-3 is the second respectively)
  const pictureContext = (props.currentId === "3-2") ? "batteries" : "robot";
  // grab widget values from the store that correspond to this session
  const instanceWidgetStores: Array<WidgetValue> = useWidgetsStore().values;
  const scouterName: string = instanceWidgetStores.find((widget: WidgetValue) => widget.name === "scouter_name")?.value.toString()!;
  const teamNumber: string = instanceWidgetStores.find((widget: WidgetValue) => widget.name === "team_number")?.value.toString()!;
  const uuid: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // create file name using scouter name, team number, and a random uuid to make sure the file name is unique when multiple photos are taken
  let fileName = `${scouterName}_${teamNumber}_${pictureContext}_${uuid}`;
  if (!scouterName) {
    console.log("Scouter name not found in stores, probably wasn't entered yet");
    buttonText = "Failure.. Scouter name not entered";
    // change text back to normal after 4 seconds
    setTimeout(() => {
      buttonText = "Take Picture";
    }, 4000);
    return;
  }
  if (!teamNumber || teamNumber === "0") {
    console.log("Team number not found in stores, probably wasn't entered yet");
    buttonText = "Failure.. Team number not entered";
    // change text back to normal after 4 seconds
    setTimeout(() => {
      buttonText = "Take Picture";
    }, 4000);
    return;
  }

  buttonText = "Uploading...";
  try {
    const image = e.target.files[0];
    if (!image) return; // no image was selected or taken, just a button click (user cancelled probably)
    console.log(`File collected from user: ${image.name}`);
    // add file extension to file name (e.g: .png, .jpg, etc.)
    fileName += `.${image.name.split(".").pop()}`;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async (e: any) => {
      imageRawBase64 = e.target.result;
      // remove everything before the comma and the comma itself
      imageCorrectedBase64 = imageRawBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      // convert to buffer
      imageBinary = Buffer.from(imageCorrectedBase64, "base64");
      const result = await client.putFileContents(fileName, imageBinary, {
        onUploadProgress: progress => {
          // get upload progress as percentage and update button text as upload progresses
          const percentage = Math.round((progress.loaded * 100) / progress.total);
          console.log(`Uploaded ${percentage}%`);
          console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
          if (percentage === 100) {
            buttonText = `Uploading... ${percentage}%`;
            setTimeout(() => {
              buttonText = "Processing on Server...";
            }, 1000);
          }
          else {
            buttonText = `Uploading... ${percentage}%`;
          }
        },
        overwrite: true
      });
      console.log(`Upload result ${result ? "success!\nFile name on server is: " + fileName : "failure"}`);
      buttonText = result ? "Success!" : "Failure.. Try again";
      setTimeout(() => {
        if(result){
          buttonText = "Take Another";
        }
        else{
          buttonText = "Take Picture";
        }
      }, 4000);
    };
  }
  catch (e) {
    console.error(e);
    buttonText = "Failure.. Try again";
    setTimeout(() => {
      buttonText = "Take Picture";
    }, 4000);
  }
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
