import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useMemo, useState } from "react";
import { Star, StarOutline } from "@mui/icons-material";
import clsx from "clsx";

const { format } = require("d3-format");

export default function Rate() {
  const [hover, setHover] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLSpanElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  // This must be a separate function to prevent a render loop,
  // see https://popper.js.org/react-popper/v2/faq/#why-i-get-render-loop-whenever-i-put-a-function-inside-the-popper-configuration
  const offsetModifier = useMemo(
    () => ({
      name: "offset",
      options: {
        offset: [-7, 5],
      },
    }),
    []
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    modifiers: [offsetModifier],
  });

  return (
    <Popover className="inline-block">
      {({ open }) => (
        <>
          <Popover.Button
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            className={clsx("cursor-pointer outline-0", {
              "text-blue-500": hover,
            })}
          >
            <span ref={setReferenceElement} className="outline-0">
              <Star
                className={clsx("h-[20px] w-[20px] pb-1 text-yellow-400", {
                  "cursor-pointer text-blue-500": hover,
                })}
              />
              <strong>{format(".2")(7.123)}</strong>
            </span>
          </Popover.Button>

          {/* Transparent overlay ensures any click outside the popover closes it */}
          <Popover.Overlay className="fixed inset-0 opacity-0" />

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {({ close }) => (
              <div className="flex flex-row items-center rounded-md border border-slate-300 bg-white px-2 py-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i + 1}>
                    <button
                      onClick={() => console.log(i + 1)}
                      className="outline-0"
                    >
                      <StarOutline className="h-[20px] w-[20px] text-blue-500"></StarOutline>
                    </button>
                  </div>
                ))}
                <div className="ml-2 border-l border-slate-300 pl-2">
                  {format(".2~s")(1352)} votes
                </div>
              </div>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
