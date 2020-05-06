const semanticLabels = {
  praise: {
    icon: "fa-trophy",
    blocking: false,
  },
  nitpick: {
    icon: "fa-search",
    blocking: true,
  },
  suggestion: {
    icon: "fa-exclamation",
    blocking: true,
  },
  issue: {
    icon: "fa-bug",
    blocking: true,
  },
  question: {
    icon: "fa-question",
    blocking: true,
  },
  thought: {
    icon: "fa-comment",
    blocking: false,
  },
  chore: {
    icon: "fa-home",
    blocking: true,
  },
};

const semanticCommentStructure = `**%label%decoration:** <subject>`;

function buttonGenerator(textarea, parent, label, blocking) {
  const button = document.createElement("button");
  const i = document.createElement("i");
  i.classList.add("fa");
  i.classList.add(semanticLabels[label].icon);
  if (blocking) {
    i.classList.add("blocking");
  }
  button.appendChild(i);
  button.addEventListener("click", function (e) {
    e.preventDefault();
    textarea.value = semanticCommentStructure
      .replace("%label", label)
      .replace("%decoration", blocking ? "" : " (non-blocking)");
    textarea.focus();
    textarea.setSelectionRange(
      textarea.value.length - 9,
      textarea.value.length
    );
  });

  parent.appendChild(button);
}

function buttonPairGenerator(textarea, parent, label) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  buttonGenerator(textarea, buttonContainer, label, false);
  if (semanticLabels[label].blocking) {
    buttonGenerator(textarea, buttonContainer, label, true);
  }
  parent.appendChild(buttonContainer);
}

function addSemanticButton(element) {
  const parent = element.closest("div");
  const container = document.createElement("div");
  container.id = "semanticButtonContainer";

  Object.keys(semanticLabels).forEach((label) => {
    buttonPairGenerator(element, container, label);
  });
  parent.appendChild(container);
}

function main() {
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "note_note" &&
      !e.target.dataset.semanticButtonInitialized
    ) {
      e.target.dataset.semanticButtonInitialized = true;
      addSemanticButton(e.target);
    }
  });
}

chrome.extension.sendMessage({}, function (response) {
  const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      main();
    }
  }, 10);
});
