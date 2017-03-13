## Classes

<dl>
<dt><a href="#Notifier">Notifier</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#resultCallback">resultCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="Notifier"></a>

## Notifier
**Kind**: global class  

* [Notifier](#Notifier)
    * [new Notifier(applicationName, [developerKey])](#new_Notifier_new)
    * _instance_
        * [.hasCallsRemaining()](#Notifier+hasCallsRemaining) ⇒ <code>bool</code>
        * [.getRemainingCalls()](#Notifier+getRemainingCalls) ⇒ <code>number</code>
        * [.getRemainingTime()](#Notifier+getRemainingTime) ⇒ <code>number</code>
        * [.isValidKey(apiKey, callback)](#Notifier+isValidKey)
        * [.sendNotification(apiKeys, event, description, [options], callback)](#Notifier+sendNotification)
    * _inner_
        * [~processRemaining(calls, timer)](#Notifier..processRemaining)

<a name="new_Notifier_new"></a>

### new Notifier(applicationName, [developerKey])
Notifier for Notify My Android.


| Param | Type | Description |
| --- | --- | --- |
| applicationName | <code>string</code> | The name of the application that is generating the call. |
| [developerKey] | <code>string</code> | Your developer key, if you have one. This is optional. |

<a name="Notifier+hasCallsRemaining"></a>

### notifier.hasCallsRemaining() ⇒ <code>bool</code>
Checks whether any remaining calls are available before the the limit is reset.

**Kind**: instance method of <code>[Notifier](#Notifier)</code>  
**Access**: public  
<a name="Notifier+getRemainingCalls"></a>

### notifier.getRemainingCalls() ⇒ <code>number</code>
Get remaining calls.

**Kind**: instance method of <code>[Notifier](#Notifier)</code>  
**Returns**: <code>number</code> - - Number of remaining calls or null if unknown.  
**Access**: public  
<a name="Notifier+getRemainingTime"></a>

### notifier.getRemainingTime() ⇒ <code>number</code>
Get remaining minutes before the limit is reset.

**Kind**: instance method of <code>[Notifier](#Notifier)</code>  
**Returns**: <code>number</code> - - Number of remaining minutes or null if unknown.  
**Access**: public  
<a name="Notifier+isValidKey"></a>

### notifier.isValidKey(apiKey, callback)
Checks whether the API key is valid.

**Kind**: instance method of <code>[Notifier](#Notifier)</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| apiKey | <code>string</code> | The api key that you want to test if it is valid. |
| callback | <code>[resultCallback](#resultCallback)</code> |  |

<a name="Notifier+sendNotification"></a>

### notifier.sendNotification(apiKeys, event, description, [options], callback)
Send a notification.

**Kind**: instance method of <code>[Notifier](#Notifier)</code>  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKeys | <code>string</code> |  | API keys separated by commas. Each API key is a 48 bytes hexadecimal string. When using multiple keys, you will only get a failure respose if all of them are not valid. |
| event | <code>string</code> |  | The event that is being notified. Depending on your application, it can be a subject or a brief description. |
| description | <code>string</code> |  | The notification text. Depending on your application, it can be a body of the message or a full description. |
| [options] | <code>object</code> |  |  |
| [options.priority] | <code>number</code> | <code>0</code> | A priority level for this notification. This is optional and in the future will be used to change the way NMA alerts you. |
| [options.url] | <code>string</code> |  | An URL/URI can be attached to your notification. You can send URL's or URI's supported by your device. The user will be able to long-click the notification and choose to follow the attached URL/URI, launching the application that can handle it. |
| [options.contentType] | <code>string</code> |  | You can set this parameter to "text/html" while sending the notification, and the basic html tags below will be interpreted and rendered while displaying the notification: &lt;a href="..."&gt;, &lt;b&gt;, &lt;big&gt;, &lt;blockquote&gt;, &lt;br&gt;, &lt;cite&gt;, &lt;dfn&gt;, &lt;div align="..."&gt;, &lt;em&gt;, &lt;font size="..." color="..." face="..."&gt;, &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;h4&gt;, &lt;h5&gt;, &lt;h6&gt;, &lt;i&gt;, &lt;p&gt;, &lt;small&gt;, &lt;strike&gt;, &lt;strong&gt;, &lt;sub&gt;, &lt;sup&gt;, &lt;tt&gt;, &lt;u&gt;. |
| callback | <code>[resultCallback](#resultCallback)</code> |  |  |

<a name="Notifier..processRemaining"></a>

### Notifier~processRemaining(calls, timer)
Processes the remaining calls and minutes from the request.

**Kind**: inner method of <code>[Notifier](#Notifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| calls | <code>string</code> | The remaining calls. |
| timer | <code>string</code> | The remaining minutes. |

<a name="resultCallback"></a>

## resultCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | The error or null if not available. |
| success | <code>bool</code> | Indicates whether the result had no errors. |

