// path: @/lib/util/render-util.js

import { Avatar, Space, Tag, Typography, Card, Flex, Badge } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import {
  formatDateYYYYMMDD,
  formatDateMMDD,
  formatTimeHHMM,
  formatMoneyVND,
  formatPercentage,
} from "@/lib/util/format-util";
import { COLORS_ENUM } from "@/component/config/selection-config";

const { Text } = Typography;

export function renderTextArea(text) {
  return (
    <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {text}
    </div>
  );
}

export function renderTagFromEnum(key = null, enumData, label = null, props) {
  if (!key && !label) {
    return null;
  }

  let displayText;

  if (!enumData[key]) {
    displayText = label ? label : key;
    return displayText;
  }

  const { text, status, color } = enumData[key];
  displayText = label ? label : text;
  return (
    <Tag {...props} color={status ? status : color}>
      {displayText ? displayText : text}
    </Tag>
  );
}

export function renderTagsFromArray(keys, enumData) {
  if (!keys || keys === "-") {
    return null;
  }

  if (typeof keys === "string") {
    keys = keys.split(", ");
  }

  if (!Array.isArray(keys) || !enumData) {
    return null;
  }

  return (
    <Space size={4} wrap>
      {keys.map((key) => {
        if (!enumData[key]) return null;

        const { text, status, color } = enumData[key];
        return (
          <Tag key={key} color={status ? status : color}>
            {text}
          </Tag>
        );
      })}
    </Space>
  );
}

export function renderDateRange(start, end) {
  const startDate = formatDateYYYYMMDD(start) || "...";
  const endDate = formatDateYYYYMMDD(end) || "...";
  return (
    <Space direction="vertical" size={4}>
      <Text>Từ: {startDate}</Text>
      <Text>Đến: {endDate}</Text>
    </Space>
  );
}

export function renderDateRangeShort(start, end) {
  const startDate = formatDateMMDD(start) || "...";
  const endDate = formatDateMMDD(end) || "...";
  return (
    <Space size={4} split="-">
      <Text>{startDate}</Text>
      <Text>{endDate}</Text>
    </Space>
  );
}

export function renderTimeRange(start, end) {
  const formattedStart = formatTimeHHMM(start);
  const formattedEnd = formatTimeHHMM(end);

  return (
    <Space direction="vertical" size={4}>
      <Text>Từ: {formattedStart}</Text>
      <Text>Đến: {formattedEnd}</Text>
    </Space>
  );
}

// Table's column render
export function renderUser(record, statusEnum, roleEnum) {
  const { user_name, user_desc, user_status_id, role_names } = record;
  return (
    <Space direction="vertical" size={4} wrap>
      {user_name && (
        <Text strong>
          <Space wrap>
            {user_name} {renderTagFromEnum(user_status_id, statusEnum)}
          </Space>
        </Text>
      )}
      {user_desc && <Text type="secondary">{user_desc}</Text>}
      {role_names && renderTagsFromArray(record.role_names, roleEnum)}
    </Space>
  );
}

export function renderUserAvatar(record) {
  const { user_avatar } = record;
  return (
    <Avatar
      icon={<UserOutlined />}
      src={user_avatar}
      size={64}
      shape="circle"
    />
  );
}

export function renderUserContact(record) {
  const { user_email, user_phone, user_parent_phone } = record;
  return (
    <Space direction="vertical" size={4}>
      {user_email && (
        <Text>
          <MailOutlined /> {user_email}
        </Text>
      )}
      {user_phone && (
        <Text>
          <PhoneOutlined /> {user_phone}
        </Text>
      )}
      {user_parent_phone && (
        <Text>
          <UserOutlined /> {user_parent_phone}
        </Text>
      )}
    </Space>
  );
}

export function renderLesson(record) {
  const { lesson_name, lesson_no, lesson_desc } = record;
  return (
    <Space direction="vertical" size={4}>
      <Space size={4}>
        {lesson_no && <Text>{`${lesson_no}. `}</Text>}
        <Text>{lesson_name}</Text>
      </Space>
      <Text type="secondary">{renderTextArea(lesson_desc)}</Text>
    </Space>
  );
}

export function renderResourceEndpoint(record, methodEnum) {
  const { resource_endpoint, resource_method } = record;
  return (
    <Space>
      <Text>{resource_endpoint}</Text>
      {renderTagFromEnum(resource_method, methodEnum)}
    </Space>
  );
}

export function renderSectionModule(record, statusEnum) {
  const { course_name, module_name, section_status_dynamic } = record;
  return (
    <Space direction="vertical" size={4}>
      <Space>
        <Text strong>{module_name}</Text>
        <Text type="secondary">{course_name}</Text>
      </Space>
      {renderTagFromEnum(section_status_dynamic, statusEnum)}
    </Space>
  );
}

export function renderSectionFee(record) {
  const { section_fee, section_total_fee } = record;
  return (
    <Space direction="vertical" size={4}>
      <Text>{`Buổi: ${formatMoneyVND(section_fee)}`}</Text>
      <Text>{`Khoá: ${formatMoneyVND(section_total_fee)}`}</Text>
    </Space>
  );
}

export function renderEnrollment(record, typeEnum, statusEnum) {
  const { user_name, enrollment_type_id, enrollment_status_dynamic } = record;
  return (
    <Space direction="vertical" size={4}>
      <Text strong>{user_name}</Text>
      <Space>
        {renderTagFromEnum(enrollment_type_id, typeEnum)}
        {renderTagFromEnum(enrollment_status_dynamic, statusEnum)}
      </Space>
    </Space>
  );
}

export function renderEnrollmentPayment(record, paymentTypeEnum) {
  const {
    enrollment_payment_type_id,
    enrollment_payment_amount,
    enrollment_payment_discount,
  } = record;
  return (
    <Space direction="vertical" size={4}>
      <Text>{`Số tiền: ${formatMoneyVND(enrollment_payment_amount)}`}</Text>
      {renderTagFromEnum(enrollment_payment_type_id, paymentTypeEnum)}
      {enrollment_payment_discount > 0 && (
        <Text>{`CK: ${formatPercentage(enrollment_payment_discount)}`}</Text>
      )}
    </Space>
  );
}

export function renderScheduleTime(record) {
  const { shift_name, shift_start_time, shift_end_time } = record;
  return (
    <Space size={4}>
      <Text>{shift_name}</Text>
      <Text type="secondary">
        {`(${formatTimeHHMM(shift_start_time)} - ${formatTimeHHMM(
          shift_end_time
        )})`}
      </Text>
    </Space>
  );
}

export function renderEventCard(info) {
  const {
    shift_start_time,
    room_name,
    class_name,
    module_name,
    lesson_name,
    schedule_status_color,
  } = info.event.extendedProps;

  const { color, bgColor } = COLORS_ENUM[schedule_status_color];

  const styles = {
    title: {
      fontSize: "0.8em",
      fontWeight: 1000,
      color: color,
    },
    text: {
      fontSize: "0.8em",
      color: color,
    },
    card: {
      borderRadius: 2,
      backgroundColor: bgColor,
      borderColor: color,
      border: `0.8px solid ${color}`,
      width: "100%",
    },
  };
  return (
    <Card size="small" style={styles.card}>
      <Space direction="vertical" size={0} wrap style={{ width: "100%" }}>
        <Flex justify="space-between" wrap style={{ width: "100%" }}>
          <Text style={styles.title}>{formatTimeHHMM(shift_start_time)}</Text>
          <Text strong style={styles.text}>
            {room_name}
          </Text>
        </Flex>
        <Space wrap size={[4, 0]}>
          <Text strong style={styles.text}>
            {class_name}
          </Text>
          <Text style={styles.text}>{module_name}</Text>
        </Space>
        <Text italic style={styles.text}>
          {lesson_name}
        </Text>
      </Space>
    </Card>
  );
}

// manager > schedules
export function renderMSCard(info) {
  const { class_name, module_name, schedule_status_color } =
    info.event.extendedProps;
  const { color } = COLORS_ENUM[schedule_status_color];

  const styles = {
    title: {
      fontSize: "1em",
      fontWeight: 800,
      color: color,
    },
    text: {
      fontSize: "1em",
    },
    container: { padding: "0 4px" },
  };
  return (
    <Space size={[4, 0]} style={styles.container}>
      <Badge color={schedule_status_color} status={schedule_status_color} />
      <Space wrap size={[3, 0]}>
        <Text style={styles.title}>{class_name}</Text>
        <Text style={styles.text}>{module_name}</Text>
      </Space>
    </Space>
  );
}
