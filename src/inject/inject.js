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

const fillTextAreaValue = (textarea, value) => {
  textarea.value = value;
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length - 9, textarea.value.length);
};

const semanticButtonClickHandler = (e, { textarea, label, blocking }) => {
  e.preventDefault();
  const semanticComment = semanticCommentStructure
    .replace("%label", label)
    .replace("%decoration", blocking ? "" : " (non-blocking)");
  if (textarea.value && !textarea.value.endsWith(":** <subject>")) {
    if (
      window.confirm("Are you sure you want to replace the current comment?")
    ) {
      fillTextAreaValue(textarea, semanticComment);
    }
  } else {
    fillTextAreaValue(textarea, semanticComment);
  }
};

const buttonGenerator = (textarea, parent, label, blocking) => {
  const button = document.createElement("button");
  const i = document.createElement("i");
  i.classList.add("fa");
  i.classList.add(semanticLabels[label].icon);
  if (blocking) {
    i.classList.add("blocking");
  }
  button.appendChild(i);
  button.addEventListener("click", (e) =>
    semanticButtonClickHandler(e, { textarea, label, blocking })
  );
  parent.appendChild(button);
};

const buttonPairGenerator = (textarea, parent, label) => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  buttonGenerator(textarea, buttonContainer, label, false);
  if (semanticLabels[label].blocking) {
    buttonGenerator(textarea, buttonContainer, label, true);
  }
  parent.appendChild(buttonContainer);
};

const addSemanticButton = (element) => {
  const parent = element.closest("div");
  const container = document.createElement("div");
  container.id = "conventionalCommentButtonContainer";

  Object.keys(semanticLabels).forEach((label) => {
    buttonPairGenerator(element, container, label);
  });
  parent.appendChild(container);
};

document.addEventListener("click", (e) => {
  if (
      e.target.id === "note_note" &&
      !e.target.dataset.semanticButtonInitialized
  ) {
    e.target.dataset.semanticButtonInitialized = true;
    addSemanticButton(e.target);
  }
});
