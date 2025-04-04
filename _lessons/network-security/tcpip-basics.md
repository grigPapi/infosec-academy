---
title: Модель TCP/IP - основы
topic: network-security
topic_title: Сетевая безопасность
course: networks
course_order: 3
total_lessons: 10
reading_time: 7
difficulty: beginner
last_updated: 2025-04-02
---

## Введение {#introduction}

Модель TCP/IP (Transmission Control Protocol/Internet Protocol) является фундаментальной концепцией в мире компьютерных сетей и интернета. Она представляет собой набор протоколов и правил, которые определяют, как данные должны передаваться между устройствами в сети. Понимание этой модели критически важно для специалистов по информационной безопасности, так как многие уязвимости и атаки направлены именно на различные уровни TCP/IP.

В этом уроке мы рассмотрим основы модели TCP/IP, ее структуру, компоненты и принципы работы. Также мы обсудим аспекты безопасности, связанные с каждым уровнем модели, и как эти знания могут помочь вам в обеспечении защиты сетевой инфраструктуры.

> **Примечание:** Модель TCP/IP иногда сравнивают с моделью OSI, которую мы рассмотрели в предыдущем уроке. Хотя между ними есть сходства, модель TCP/IP более практична и широко используется в реальных сетевых реализациях.

## Модель TCP/IP {#tcpip-model}

### История создания {#history}

Модель TCP/IP была разработана в 1970-х годах Министерством обороны США как часть проекта DARPA (Defense Advanced Research Projects Agency). Основной целью было создание стандартизированного способа коммуникации между различными компьютерными системами, который мог бы функционировать даже при частичном повреждении сети.

В отличие от модели OSI с её семью уровнями, модель TCP/IP имеет более прагматичный подход и состоит из четырех основных уровней. Эта модель стала основой для развития современного интернета и по сей день является доминирующим стандартом сетевых коммуникаций.

### Уровни модели TCP/IP {#layers}

Модель TCP/IP состоит из четырех уровней:

1. **Уровень сетевого доступа (Network Access Layer)** - отвечает за физическую передачу данных между устройствами в локальной сети.
2. **Интернет-уровень (Internet Layer)** - обеспечивает маршрутизацию пакетов данных между различными сетями.
3. **Транспортный уровень (Transport Layer)** - отвечает за надежную передачу данных между конечными устройствами.
4. **Уровень приложения (Application Layer)** - предоставляет сетевые сервисы конечным пользователям и приложениям.

> **Совет:** Для запоминания уровней модели TCP/IP можно использовать мнемоническое правило "НИТП" (Нетворк-Интернет-Транспорт-Приложение) или английский вариант "NITA" (Network-Internet-Transport-Application).

![Модель TCP/IP](/assets/images/diagrams/tcpip-model.png)

| Уровень TCP/IP | Соответствие уровням OSI | Основные протоколы |
|----------------|--------------------------|-------------------|
| Уровень приложения | 5-7 (Сеансовый, Представления, Приложения) | HTTP, SMTP, FTP, DNS, SSH |
| Транспортный уровень | 4 (Транспортный) | TCP, UDP |
| Интернет-уровень | 3 (Сетевой) | IP, ICMP, ARP |
| Уровень сетевого доступа | 1-2 (Физический, Канальный) | Ethernet, Wi-Fi, PPP |

## Уровень сетевого доступа {#network-access-layer}

Уровень сетевого доступа является самым нижним уровнем модели TCP/IP и объединяет функциональность физического и канального уровней модели OSI. Он отвечает за физическую передачу данных между устройствами в локальной сети.

Основные функции уровня сетевого доступа:
* Определение характеристик физической среды передачи данных (кабели, беспроводная связь)
* Управление доступом к среде передачи данных
* Формирование кадров данных (фреймов)
* Адресация на уровне физических устройств (MAC-адреса)
* Обнаружение и исправление ошибок на уровне кадров

На этом уровне работают такие технологии как Ethernet, Wi-Fi, PPP, Token Ring и др. Каждая из этих технологий имеет свои особенности и протоколы, определяющие правила передачи данных.

{: .warning }
**Важно для безопасности:** На уровне сетевого доступа возможны такие атаки как ARP-спуфинг, MAC-флудинг, подслушивание в беспроводных сетях и физическое подключение к сети. Защита на этом уровне включает сегментацию сети, шифрование беспроводного трафика, контроль физического доступа к сетевому оборудованию и технологии защиты портов коммутаторов.

```bash
# Пример проверки MAC-адреса сетевого интерфейса в Linux
ifconfig eth0 | grep ether

# Вывод может выглядеть примерно так:
# ether 00:11:22:33:44:55  txqueuelen 1000  (Ethernet)
```

## Интернет-уровень {#internet-layer}

<!-- Остальной контент урока... -->

## Заключение {#conclusion}

Модель TCP/IP является основой современных компьютерных сетей и интернета. Понимание ее структуры, принципов работы и аспектов безопасности критически важно для специалистов по информационной безопасности.

В этом уроке мы рассмотрели четыре уровня модели TCP/IP: уровень сетевого доступа, интернет-уровень, транспортный уровень и уровень приложения. Мы изучили основные протоколы, работающие на каждом уровне, и обсудили соответствующие аспекты безопасности.

В следующем уроке мы более подробно рассмотрим уровень приложения модели TCP/IP и изучим протоколы, работающие на этом уровне, а также их уязвимости и методы защиты.

### Дополнительные материалы

* [RFC 1122 - Требования к интернет-хостам - коммуникационные уровни](https://tools.ietf.org/html/rfc1122)
* [Книга "TCP/IP Illustrated" by W. Richard Stevens](https://www.amazon.com/TCP-Illustrated-Vol-Addison-Wesley-Professional/dp/0201633469)
* [OWASP - Руководство по тестированию веб-приложений](https://owasp.org/www-project-web-security-testing-guide/)
* [Wireshark - Анализатор сетевого трафика](https://www.wireshark.org/)
* [Видеокурс "Сетевая безопасность на практике"](#)

{% include quiz-section.html %}