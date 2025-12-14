import React from "react";
import Applications from "./statusCards/applications";
import Enrollments from "./statusCards/enrollments";
import Financial from "./statusCards/financial";
// import TotalTuitionCollected from "./statusCards/tasks";
import Tasks from "./statusCards/tasks";

const status = () => {
  return (
    <section className="flex flex-wrap gap-5 mb-8">
      <Applications />
      <Enrollments />
      <Financial />
      {/* <TotalTuitionCollected /> */}
      <Tasks/>
    </section>
  );
};

export default status;

