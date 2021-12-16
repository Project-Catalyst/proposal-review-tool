<template>
  <div class="section container">
    <b-message>
      <p>This tool is designed to help proposers to review the CA assessments they received. It's a community made tool for the community. Please report any bugs.</p>
    </b-message>

    <b-message type="is-warning" has-icon>
      This tool uses localStorage and cookies to store the progress of your work.<br />
      If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your work! You should export (download) the file, and re-import it every time or add a exception to your browser's settings.<br />
      We plan to add server authentication mechanism in the future versions to avoid this problem.
    </b-message>

    <b-message type="is-info" has-icon v-if="profile.localDb">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already loaded in the app.<br />
        You can continue your work clicking on the button below.
      </p>

    </b-message>

    <div class="buttons">
      <b-button
        type="is-primary"
        tag="router-link"
        :to="{ name: buttonInfo.link }"
        expanded
      >
        {{ buttonInfo.text }}</b-button
      >
    </div>
    <b-message>
      <div class="content">
        <p><b>How it works</b><br /></p>
        <p>The proposal-review-tool is designed to work in parallel with the standard way (using the Google Sheet) to offer a better user experience to the process.<br />
        Consider it as an experiment that hopefully can be used as the standard method in the future funds.<br /><br /></p>
        <ol>
          <li>
            Click on the "Start Process" button.
          </li>
          <li>
            On the next screen fill in your details: "IdeaScale username" & "email address".<br />
            Choose an option to start your process:
            <ol type="a" class="mt-0">
              <li>"I want to start the process from the beginning, I don't have a backup file to import". <u>This create a clean review space</u>.</li>
              <li>I want to continue the process, I have a backup file to import". <u>This will allow you to import a previous exported session</u>.</li>
            </ol>
          </li>
          <li>
            Search for and select your proposals (please only review the proposals you are a proposer on, otherwise your reviews will be excluded).
          </li>
          <li>
            Review the CA assessment, if it is acceptable continue with the next assessment or finish the process.<br />
            If an assessment requires attention from the Community QA participants (vCAs) flag it and provide your reason for doing so (provide a reason is mandatory in case of flagging).<br />
            You can use this space to provide feedback (both positive and constructive criticism) to the CA without flagging the assessment.
          </li>
          <li>
            When your review is complete from the menu click "Export CSV", save the file.
          </li>
          <li>
            This is the final file that you'll have to share at the end of the QA process. This file file can also be re-imported in the proposal-review-tool to edit/check/continue your reviews.<br />
            Upload the final export to Google Docs, change the share settings to "Anyone with the link" and fill in <a href="#">this form</a> with your details and the link to your file.
          </li>
        </ol>
        <p><b>Useful resources</b><br /></p>
        <p>
          <a href="https://docs.google.com/document/d/1vHapUV1LHM4cb2375V99oM32xJ-wj_XoN-DYcvKEk0A/edit?usp=sharing">QA Stage Guide</a><br />
          <a href="https://docs.google.com/document/d/1QkdaFK1tigrSI40iMeV3UP9GyTGsoqVmCUp7OJz0WFs">Community Advisor Guide</a><br />
          <a href="https://docs.google.com/document/d/1g-iZhDlKhUBZkui1uv8NVNfJC4oVD3JtR-P6Fue7XPU/edit">Proposal Assessment Guide</a><br />
        </p>
      </div>


    </b-message>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState({
      profile: (state) => state.profile
    }),
    buttonInfo() {
      if (this.profile.localDb) {
        return {
          text: 'Continue Process',
          link: 'conditions'
        }
      } else {
        return {
          text: 'Start Process',
          link: 'profile'
        }
      }
    },
  }
};
</script>
