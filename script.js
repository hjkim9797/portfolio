const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const contactForm = document.getElementById("contactForm");
const responseMessage = document.getElementById("responseMessage");
const visitorMessage = document.getElementById("visitorMessage");
const messageCounter = document.getElementById("messageCounter");
const submitButton = document.getElementById("submitButton");
const makeWebhookUrl = "https://hook.us1.make.com/your_unique_webhook_id";

// AI 텍스트 분류 버튼용 웹훅 (make.com에서 새로 만든 시나리오의 웹훅 URL로 교체하세요)
const classifyWebhookUrl = "2iprpsdrvqgsdcjukphmr1s40v0r3k40@hook.us2.make.com";

function showResponseMessage(type, message) {
  responseMessage.className = `response-message is-${type}`;
  responseMessage.innerText = message;
}

function setSubmitLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.innerText = isLoading
    ? "접수 중..."
    : "AI 에이전트에게 질문하기";
}

if (visitorMessage && messageCounter) {
  visitorMessage.addEventListener("input", () => {
    messageCounter.innerText = `${visitorMessage.value.length} / 500`;
  });
}

if (contactForm && responseMessage && submitButton) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("visitorName").value.trim();
    const email = document.getElementById("visitorEmail").value.trim();
    const message = document.getElementById("visitorMessage").value.trim();
    const website = document.getElementById("visitorWebsite").value;

    if (website) {
      return;
    }

    if (!name || !email || !message) {
      showResponseMessage(
        "error",
        "이름, 이메일, 질문을 모두 입력해주세요."
      );
      return;
    }

    showResponseMessage(
      "loading",
      "AI 에이전트가 질문을 분석 중입니다... 잠시만 기다려주세요."
    );
    setSubmitLoading(true);

    try {
      const response = await fetch(makeWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitor_name: name,
          visitor_email: email,
          visitor_message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      showResponseMessage(
        "success",
        "질문이 성공적으로 접수되었습니다! 입력하신 메일로 AI의 답변이 곧 발송됩니다."
      );
      contactForm.reset();
      messageCounter.innerText = "0 / 500";
    } catch (error) {
      showResponseMessage(
        "error",
        "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setSubmitLoading(false);
    }
  });
}

// ---------------------------
// AI 텍스트 분류 버튼
// ---------------------------
const classifyText = document.getElementById("classifyText");
const classifyCounter = document.getElementById("classifyCounter");
const classifyButton = document.getElementById("classifyButton");
const classifyResponseMessage = document.getElementById(
  "classifyResponseMessage"
);

function showClassifyMessage(type, message) {
  classifyResponseMessage.className = `response-message is-${type}`;
  classifyResponseMessage.innerText = message;
}

function setClassifyLoading(isLoading) {
  classifyButton.disabled = isLoading;
  classifyButton.innerText = isLoading ? "분류 요청 중..." : "분류하기";
}

if (classifyText && classifyCounter) {
  classifyText.addEventListener("input", () => {
    classifyCounter.innerText = `${classifyText.value.length} / 1000`;
  });
}

if (classifyButton && classifyText && classifyResponseMessage) {
  classifyButton.addEventListener("click", async () => {
    const text = classifyText.value.trim();

    if (!text) {
      showClassifyMessage("error", "분류할 텍스트를 입력해주세요.");
      return;
    }

    showClassifyMessage(
      "loading",
      "AI가 텍스트를 분석 중입니다... 잠시만 기다려주세요."
    );
    setClassifyLoading(true);

    try {
      const response = await fetch(classifyWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      showClassifyMessage(
        "success",
        "분류 요청이 접수되었습니다! 담당자 이메일로 승인 요청이 곧 발송됩니다."
      );
      classifyText.value = "";
      classifyCounter.innerText = "0 / 1000";
    } catch (error) {
      showClassifyMessage(
        "error",
        "요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setClassifyLoading(false);
    }
  });
}
