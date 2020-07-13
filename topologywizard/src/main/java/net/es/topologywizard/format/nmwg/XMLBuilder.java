package net.es.topologywizard.format.nmwg;

import java.io.*;

import org.json.XML;
import org.w3c.dom.*;

import javax.xml.parsers.*;

import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;



public class XMLBuilder 
{

	public static void convertToNMWGXml()
	{
        try {
          
            //Creating an empty XML Document

            DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
            Document doc = docBuilder.newDocument();

            //Creating the XML tree
            
            Element root = doc.createElementNS("http://ogf.org/schema/network/topology/ctrlPlane/20080828/","CtrlPlane:topology");
            
            doc.appendChild(root);
       
            root.setAttribute("id","testdomain-1");
            
            //create a comment and put it in the root element
            Comment comment = doc.createComment("NMWG topology information");
            root.appendChild(comment);

            //create child element, add an attribute, and add to root
            Element child = doc.createElement("child");
            child.setAttribute("name", "value");
            root.appendChild(child);

            //add a text element to the child
            Text text = doc.createTextNode("data goes here");
            child.appendChild(text);

            /////////////////
            //Output the XML

            //set up a transformer
            TransformerFactory transfac = TransformerFactory.newInstance();
            Transformer trans = transfac.newTransformer();
            trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            trans.setOutputProperty(OutputKeys.INDENT, "yes");

            //create string from xml tree
            StringWriter sw = new StringWriter();
            StreamResult result = new StreamResult(sw);
            DOMSource source = new DOMSource(doc);
            trans.transform(source, result);
            String xmlString = sw.toString();

            
           

        } catch (Exception e) {
            System.out.println(e);
        }

	}	
	
}
