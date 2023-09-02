import { component$, useStyles$ } from "@builder.io/qwik";
import logo from "./logo.css?inline";

export default component$(() => {
  useStyles$(logo);

  return (
    <div class="circle-container">
      <div class="circle">
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
        <div class="segment" />
      </div>
      <div class="hole"></div>
    </div>
  );
});
