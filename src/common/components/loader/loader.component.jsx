import React from "react";
import { BounceLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0px 0 0 0px",
  borderColor: "white",
};

function Loader({ loading }) {
  return (
    <BounceLoader
      color="white"
      loading={loading}
      cssOverride={override}
      size={18}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Loader;
