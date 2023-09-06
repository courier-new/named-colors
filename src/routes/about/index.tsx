import { component$, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import index from "./index.css?inline";

export default component$(() => {
  useStyles$(index);

  return (
    <div class="about text-gray-600 dark:text-slate-500 leading-6 max-w-3xl">
      <h2>About this site</h2>
      <p class="mb-5">
        I created this site as a fun way to learn{" "}
        <a href="https://qwik.builder.io/" target="_blank">
          Qwik
        </a>
        , as well as to celebrate the underappreciated expansion of named colors
        in the CSS spec over time.
      </p>

      <h2>A brief history of the named colors</h2>
      <h3>A magical discovery</h3>
      <p class="mb-5">
        Growing up and coming online in the earl- to mid-2000s, my first
        exposure to web development came in the form of discovering how you
        could play with the colors of text, backgrounds, borders, and other
        "boxes" on the screen with certain text annotations in this weird
        language called "CSS". Ask just about anyone, and they would be able to
        tell you with a high level of confidence what sort of visual effect{" "}
        <code>background-color:red</code> is going to produce. Especially to a
        kid, there's something magical about being able to so intuitively
        control what appears on your screen with a few keystrokes.
      </p>
      <p class="mb-5">
        At the time, budding enthusiasts and professionals alike would have
        found their palette limited to the{" "}
        <Link href="/?tags=level-2" target="_blank">
          17 unique colors
        </Link>{" "}
        (18 only if you count gray/grey) implemented by most browsers based on
        the{" "}
        <a
          href="https://www.w3.org/TR/CSS21/syndata.html#color-units"
          target="_blank"
        >
          CSS 2.1 spec
        </a>
        . At least, if you wanted to use a human-readable value like red, blue,
        green, or white—a so-called{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color"
          target="_blank"
        >
          named color
        </a>
        .
      </p>

      <h3>From blanchedalmond to lightsalmon</h3>
      <p class="mb-5">
        But it turns out, designers and developers have long since been working
        with a larger, more expressive palette of colors for more than a decade.
        These colors, which had had their start in the{" "}
        <a href="https://en.wikipedia.org/wiki/X_Window_System" target="_blank">
          X Window System
        </a>{" "}
        in the 1980s when color GUIs were still a novelty, were known as the{" "}
        <a href="https://en.wikipedia.org/wiki/X11_color_names" target="_blank">
          X11 color names
        </a>
        , due to their implementation in version 11 of the system.
      </p>
      <p class="mb-5">
        In those early days, there had been plenty of resistance to adopting a
        standardized color list, due in equal parts to technical concerns
        (memory being a highly limited resource) and human ones (any such list
        would ultimately be arbitrary and subjective). But over the years,
        developers continued to contribute colors to the list, with substantial
        additions from Paul Ravelling (who added colors based on{" "}
        <a
          href="https://www.cyberneticforests.com/news/who-chose-the-colors-of-birds-four-lessons-about-data-from-the-history-of-color"
          target="_blank"
        >
          paint swatches he had laying around his house from a local paint
          company, Sinclair Paints
        </a>
        ) and John C. Thomas (who added colors based on{" "}
        <a
          href="https://groups.google.com/g/comp.windows.x/c/eF3SibkdzVI/m/ztU9Xm2W0PAJ"
          target="_blank"
        >
          "the handiest standard of subjective color names, a box of 72 Crayola
          crayons"
        </a>
        ), among others.
      </p>
      <p class="mb-5">
        With time, the resistance faded, and the X11 colors spread to the more
        popular Mac and PC operating systems, thereby becoming the de facto
        standard. But it would be a while still before the set of ~140 colors
        made their way into the CSS spec, and even longer before they would be
        widely supported by browsers. Though the colors were first published in
        a working draft of the CSS 3 Color Module in 2001, it would take until{" "}
        <a
          href="https://www.w3.org/Style/CSS/Test/CSS3/Color/20081014/reports/CR-ImpReport.html"
          target="_blank"
        >
          2008
        </a>{" "}
        for browser implementations to fully mature.
      </p>

      <h3>A colorful mess</h3>
      <p class="mb-5">
        The CSS color specification is by no means perfect. Its evolution has
        been{" "}
        <a
          href="https://increment.com/frontend/ask-an-expert-why-is-css-the-way-it-is/"
          target="_blank"
        >
          criticized
        </a>{" "}
        for overly favoring incremental improvements and adopting suggestions
        without sufficient review. The set of named colors themselves are{" "}
        <a
          href="https://arstechnica.com/information-technology/2015/10/tomato-versus-ff6347-the-tragicomic-history-of-css-color-names/?comments=1&comments-page=1"
          target="_blank"
        >
          inconsistently named
        </a>
        ,{" "}
        <a
          href="https://lists.w3.org/Archives/Public/www-style/1996Feb/0016.html"
          target="_blank"
        >
          euro-centrically derived
        </a>{" "}
        (sometimes to a degree which could even be{" "}
        <a
          href="https://github.com/w3c/csswg-drafts/issues/5284"
          target="_blank"
        >
          considered insensitive
        </a>
        ),{" "}
        <a
          href="https://homepages.cwi.nl/~steven/css/x11huegraph.html"
          target="_blank"
        >
          unevenly distributed across hues
        </a>
        , and{" "}
        <a href="https://www.youtube.com/watch?v=HmStJQzclHc" target="_blank">
          largely calibrated based on one guy's HP monitor 30 years ago
        </a>
        .
      </p>
      <p class="mb-5">
        Practically, the colors also have limited utility. In 2022, the HTTP
        Archive's annual Web Almanac found that out of over 8M websites, only{" "}
        <a
          href="https://almanac.httparchive.org/en/2022/css#colors"
          target="_blank"
        >
          2% of sites
        </a>{" "}
        use named colors, and of those, the majority are only using{" "}
        <code>transparent</code>,{" "}
        <Link href="/colors/white/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5 border b-gray-600 dark:border-none"
            style={{ backgroundColor: "white" }}
          />
          white
        </Link>
        , or{" "}
        <Link href="/colors/black/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5"
            style={{ backgroundColor: "black" }}
          />
          black
        </Link>
        .
      </p>
      <h3>
        A <em>beautiful</em>, colorful mess
      </h3>
      <p class="mb-5">
        The thing is, the named colors were never meant to be comprehensive,
        mathematically precise, or even a system at all, really, and to only
        pass judgment on them as such misses the point, in my opinion. They were
        someone's starting point; they were someone's naming shortcuts to colors
        they were already using; they were someone's way of adding a touch of
        their [subjective, imperfect] human experience to the [objective,
        methodical] experience of writing code.
      </p>
      <p class="mb-5">
        Just as a painter would never say that they were confined exclusively to
        the colors printed on their tubes of paint, neither is a designer or
        developer limited to just using the named colors in CSS. In reality,
        painters mix paint from different tubes together, and designers and
        developers "mix" their colors, too, with hex codes, RGB values, HSL
        values, and other formulations.
      </p>
      <p class="mb-5">
        The names don't <em>need</em> to mean <em>anything</em>. But they might
        also mean something personal to somebody. They can even be used to
        somebody in a{" "}
        <a
          href="https://medium.com/@valgaze/the-hidden-purple-memorial-in-your-web-browser-7d84813bb416"
          target="_blank"
        >
          small, meaningful, beautiful way
        </a>
        , like{" "}
        <Link href="/colors/rebeccapurple/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5"
            style={{ backgroundColor: "rebeccapurple" }}
          />
          rebeccapurple
        </Link>
        , which was added in memory of Rebecca Meyer, the daughter of{" "}
        <a href="https://meyerweb.com/" target="_blank">
          Eric Meyer
        </a>
        , a pioneer of CSS and web standards.
      </p>
      <p class="mb-5">
        Saying that the named colors are useless because they're subjectively
        chosen, don't follow a consistent set of rules, and are only used by 2%
        of production websites is like saying that most words in the English
        language are useless for the same reasons, only substitute "websites"
        for "published writing".
      </p>
      <p class="mb-5">
        People don't think and talk about colors using hex codes or RGB values,
        and adolescent Kelli writing her first lines of CSS certainly wouldn't
        have understood them either. Colors like{" "}
        <Link href="/colors/red/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5"
            style={{ backgroundColor: "red" }}
          />
          red
        </Link>
        ,{" "}
        <Link href="/colors/aqua/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5"
            style={{ backgroundColor: "aqua" }}
          />
          aqua
        </Link>
        , and{" "}
        <Link href="/colors/lime/" target="_blank" class="font-mono">
          <span
            class="inline-block h-4 w-4 rounded-full ml-0.5 mr-1 -mb-0.5"
            style={{ backgroundColor: "lime" }}
          />
          lime
        </Link>{" "}
        are discoverable, memorable, and really easy to use. And because of
        that, they're incredibly useful for a variety of activities, from
        learning to prototyping to debugging (<code>border:5px solid red</code>{" "}
        anyone?).
      </p>
      <p class="mb-5">
        The colors bring a little bit of magic 🪄 to the web—a magic that first
        opened my eyes to the possibilities of programming on the web, and that
        I hope will continue to do so for others.
      </p>
      <p class="mb-5">
        This site is my small homage to that magic. I hope you enjoy it. 🙂
      </p>

      <h2>Inspirations and other cool resources</h2>

      <ul class="mb-5">
        <li>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color"
            target="_blank"
          >
            https://developer.mozilla.org/en-US/docs/Web/CSS/named-color
          </a>
        </li>
        <li>
          <a href="https://coolors.co/" target="_blank">
            https://coolors.co/
          </a>
        </li>
        <li>
          <a
            href="https://www.joshwcomeau.com/gradient-generator/"
            target="_blank"
          >
            https://www.joshwcomeau.com/gradient-generator/
          </a>
        </li>
        <li>
          <a
            href="https://www.joshwcomeau.com/css/color-formats/"
            target="_blank"
          >
            https://www.joshwcomeau.com/css/color-formats/
          </a>
        </li>
        <li>
          <a href="https://color.hailpixel.com/" target="_blank">
            https://color.hailpixel.com/
          </a>
        </li>
        <li>
          <a
            href="https://realtimecolors.com/?colors=000000-ffffff-8fb3ff-ebf1ff-d41d6d"
            target="_blank"
          >
            https://realtimecolors.com/?colors=000000-ffffff-8fb3ff-ebf1ff-d41d6d
          </a>
        </li>
        <li>
          <a
            href="https://developer.chrome.com/articles/high-definition-css-color-guide/"
            target="_blank"
          >
            https://developer.chrome.com/articles/high-definition-css-color-guide/
          </a>
        </li>
        <li>
          <a
            href="https://blog.logrocket.com/exploring-css-color-module-level-5/"
            target="_blank"
          >
            https://blog.logrocket.com/exploring-css-color-module-level-5/
          </a>
        </li>
        <li>
          <a href="https://colornames.org/" target="_blank">
            https://colornames.org/
          </a>
        </li>
        <li>
          <a href="https://www.csscolorsapi.com/" target="_blank">
            https://www.csscolorsapi.com/
          </a>
        </li>
      </ul>

      <h1 class="dark:text-slate-300 text-3xl font-extralight mb-6">
        Thanks for visiting! 🌈
      </h1>
    </div>
  );
});
