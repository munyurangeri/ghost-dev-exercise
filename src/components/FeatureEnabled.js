import { html } from "../lib";
import FEATURE_FLAGS from "../featureFlags";

const FeatureEnabled = ({ featureFlag, child }) => {
  return html`${FEATURE_FLAGS[featureFlag] ? child : null}`;
};

export default FeatureEnabled;
